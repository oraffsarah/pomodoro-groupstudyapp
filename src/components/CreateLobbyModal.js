import React, { useState } from 'react';
import './CreateLobbyModal.css';
import useRoomManager from './rooms/useRoomManager';

const CreateLobbyModal = ({ isVisible, onClose }) => {
  const [lobbyName, setLobbyName] = useState('');
  const [maxUserCount, setMaxUserCount] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');  // New state for password
  const { createLobby } = useRoomManager();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert maxUserCount to a number and ensure it is valid
    const maxUsers = parseInt(maxUserCount, 10);
    if (!maxUsers || maxUsers <= 0) {
      alert("Max user count must be greater than 0.");
      return;
    }

    const lobbyData = {
      name: lobbyName,
      maxUsers,
      description,
      isLocked: isPrivate,
      password: isPrivate ? password : null,  // Include password only if the lobby is private
    };

    try {
      const roomId = await createLobby(lobbyData);
      console.log('Lobby created successfully with ID:', roomId);
      onClose(); // Close modal on submission
    } catch (error) {
      console.error("Error creating lobby:", error);
      alert("Failed to create lobby. Please try again.");
    }
  };

  // Early return if not visible
  if (!isVisible) return null;

  return (
    <div className="create-lobby-modal">
      <div className="modal-content">
        <h2>Create Lobby</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Lobby Name:
            <input 
              type="text" 
              value={lobbyName} 
              onChange={(e) => setLobbyName(e.target.value)} 
              required 
            />
          </label>
          <label>
            Max User Count:
            <input 
              type="number" 
              value={maxUserCount} 
              onChange={(e) => setMaxUserCount(e.target.value)} 
              required 
            />
          </label>
          <label>
            Description:
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </label>
          <label>
            Private Lobby:
            <input 
              type="checkbox" 
              checked={isPrivate} 
              onChange={(e) => setIsPrivate(e.target.checked)} 
            />
          </label>
          {isPrivate && (
            <label>
              Lobby Password:
              <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={isPrivate}
              />
            </label>
          )}
          <button type="submit">Create Lobby</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateLobbyModal;
