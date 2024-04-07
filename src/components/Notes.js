import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase-config.js';
import '../styles/Notes.css';

export const Notes = () => {
    const [notes, setNotes] = useState([{ id: 1, title: `Note 1`, content: 'My first note', color: '#FFD700' }]);
  
  // State to keep track of the currently active (selected) note by ID.
    const [activeNoteId, setActiveNoteId] = useState(1);
  
  // State to store and update the content of the currently active note.
    const [noteContent, setNoteContent] = useState('');

  // Function to create a new note. It generates a unique ID for the new note, sets its content to empty,
  // assigns it a random color, and updates the state to include the new note.
    const createNewNote = () => {
        const newId = notes.length ? notes[notes.length - 1].id + 1 : 1;
        const newNote = { id: newId, title: `Note ${newId}`, content: '', color: getRandomColor() };
        setNotes([...notes, newNote]);
        setActiveNoteId(newId); // Sets the new note as the active note
        setNoteContent(''); // Resets the note content state for the new active note
    };

    // Function to delete a specific note by its ID. Prevents deleting if only one note remains.
    const deleteNote = (noteId) => {
        if (notes.length > 1) {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        setActiveNoteId(updatedNotes[0].id); // Sets the first note as active after deletion
        setNoteContent(updatedNotes[0].content); // Updates the content state to reflect the new active note
        } else {
        alert('You must have at least one note.');
        }
    };

    // Function to handle changes to the note's content. Updates both the noteContent state and the content of the active note within the notes state.
    const handleNoteChange = (event) => {
        setNoteContent(event.target.value);
        const updatedNotes = notes.map(note => {
        if (note.id === activeNoteId) { // Finds the active note and updates its content
            return { ...note, content: event.target.value };
        }
        return note;
        });
        setNotes(updatedNotes);
    };

    const handleTitleChange = (e) => {
        console.log(e)
    }

    // Function to select (make active) a note when its tab is clicked.
    const selectNote = (noteId) => {
        const selectedNote = notes.find(note => note.id === noteId);
        setActiveNoteId(noteId);
        setNoteContent(selectedNote.content); // Updates the noteContent state to reflect the content of the active note
    };

    // Utility function to generate a random color for a new note.
    const getRandomColor = () => {
        const colors = ['#FFD700', '#ADFF2F', '#FF69B4', '#87CEEB', '#7B68EE'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="personal-notes">
        <button onClick={createNewNote}>Create New Note</button>
        <div className="notes-tabs">
            {notes.map((note) => (
            <div key={note.id} 
                className={`note-tab ${note.id === activeNoteId ? 'active' : ''}`} 
                style={{backgroundColor: note.color}}
                onClick={() => selectNote(note.id)}
                onChange={handleTitleChange}>
                {note.title}
                <button onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
            ))}
        </div>
        <textarea value={noteContent} onChange={handleNoteChange}></textarea>
        </div>
    );

}