import React, { useState, useEffect } from 'react';
import { useUser } from '../components/auth/UserContext';
import { addNote, deleteNote, fetchNotes, updateNote } from '../Firebase/FirebaseNotesService';
import "./PersonalNotes.css";

const PersonalNotes = () => {
  const { currentUser } = useUser();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState('#FFFFFF');  // Default color

  useEffect(() => {
    if (currentUser) {
      const loadNotes = async () => {
        const fetchedNotes = await fetchNotes(currentUser.uid);
        const notesArray = Object.entries(fetchedNotes || {}).map(([id, note]) => ({
          id,
          ...note
        }));
        setNotes(notesArray);
        if (notesArray.length > 0) {
          setActiveNoteId(notesArray[0].id);
          setNoteContent(notesArray[0].content);
          setNoteColor(notesArray[0].color || getRandomColor());  // Use existing or assign a random color
        }
      };
      loadNotes();
    }
  }, [currentUser]);

  const createNewNote = async () => {
    if (!currentUser || notes.length >= 5) {
      alert('Maximum of 5 notes allowed or user not logged in');
      return;
    }
    const newNoteColor = getRandomColor();
    const newNote = { content: '', color: newNoteColor };
    const savedNote = await addNote(currentUser.uid, newNote);
    setNotes([...notes, { ...savedNote, id: savedNote.id }]);
    setActiveNoteId(savedNote.id);
    setNoteContent('');
    setNoteColor(newNoteColor);
  };

  const handleDeleteNote = async (noteId) => {
    if (notes.length > 1) {
      await deleteNote(currentUser.uid, noteId);
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      setActiveNoteId(updatedNotes[0].id);
      setNoteContent(updatedNotes[0].content);
      setNoteColor(updatedNotes[0].color);
    } else {
      alert('You must have at least one note.');
    }
  };

  const handleNoteChange = async (event) => {
    const newContent = event.target.value;
    setNoteContent(newContent);
    if (activeNoteId) {
      await updateNote(currentUser.uid, activeNoteId, { content: newContent, color: noteColor });
    }
  };

  const selectNote = (noteId) => {
    const selectedNote = notes.find(note => note.id === noteId);
    setActiveNoteId(noteId);
    setNoteContent(selectedNote.content);
    setNoteColor(selectedNote.color || getRandomColor());  // Default or existing color
  };

  const getRandomColor = () => {
    const colors = ['#FFD700', '#ADFF2F', '#FF69B4', '#87CEEB', '#7B68EE'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personal-notes">
      <button onClick={createNewNote} disabled={notes.length >= 5}>Create New Note</button>
      <div className="notes-tabs">
        {notes.map((note, index) => (
          <div key={note.id} 
               className={`note-tab ${note.id === activeNoteId ? 'active' : ''}`} 
               style={{backgroundColor: note.color}}
               onClick={() => selectNote(note.id)}>
            Note {index + 1}
            <button className='btn btn-danger btn-small' onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
      <textarea value={noteContent} onChange={handleNoteChange}></textarea>
    </div>
  );
};

export default PersonalNotes;