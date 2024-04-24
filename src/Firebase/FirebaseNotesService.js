import { database } from './firebase';
import { ref, set, push, remove, get, child } from 'firebase/database';

const notesRef = (userId) => ref(database, `notes/${userId}`);

export const addNote = async (userId, note) => {
  const newNoteRef = push(notesRef(userId));
  await set(newNoteRef, note);
  return { id: newNoteRef.key, ...note };
};

export const deleteNote = async (userId, noteId) => {
  await remove(child(notesRef(userId), noteId));
};

export const fetchNotes = async (userId) => {
  const snapshot = await get(notesRef(userId));
  return snapshot.exists() ? snapshot.val() : {};
};

export const updateNote = async (userId, noteId, note) => {
  await set(child(notesRef(userId), noteId), note);
};
