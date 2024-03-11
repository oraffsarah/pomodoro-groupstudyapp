import React, { useState } from 'react';
import './CreateLobbyModal.css'; // You'll need to create corresponding CSS for this

const CreateLobbyModal = ({ isVisible, onClose, onCreate }) => {
  const [lobbyName, setLobbyName] = useState('');
  const [maxUserCount, setMaxUserCount] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate({
      name: lobbyName,
      maxUsers: parseInt(maxUserCount, 10),
      description,
      isLocked: isPrivate
    });
    onClose(); // Close modal on submission
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
          <button type="submit">Create Lobby</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateLobbyModal;
