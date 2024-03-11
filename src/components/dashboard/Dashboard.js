import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { ref, onValue, push, getDatabase } from 'firebase/database'; // Import the necessary functions for Firebase v9+
import { app } from '../../Firebase/firebase'; // Adjust this path to point to your Firebase app initialization

// Components
import SearchBar from '../SearchBar'; // Ensure the path is correct
import LobbyList from '../LobbyList'; // Ensure the path is correct
import FriendsList from '../FriendsList'; // Ensure the path is correct
import PersonalSidebar from '../PersonalSidebar'; // Ensure the path is correct
import CreateLobbyModal from '../CreateLobbyModal'; // Ensure the path is correct

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showCreateLobbyModal, setShowCreateLobbyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    const database = getDatabase(app); // Ensure you're getting the correct database instance
    const lobbyRef = ref(database, 'lobbies');

    onValue(lobbyRef, snapshot => {
      const lobbiesData = snapshot.val();
      const lobbiesList = lobbiesData ? Object.keys(lobbiesData).map(key => ({
        ...lobbiesData[key],
        id: key,
      })) : [];
      setLobbies(lobbiesList);
    });

    // Make sure to properly handle the cleanup
    return () => {
      // This is handled automatically by Firebase SDK
    };
  }, []);

  const handleCreateLobby = (newLobby) => {
    const database = getDatabase(app); // Get the database instance
    push(ref(database, 'lobbies'), newLobby); // Use push() to add a new lobby
    setShowCreateLobbyModal(false); // Close the modal
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleFriendsList = () => setShowFriendsList(!showFriendsList);
  const openCreateLobbyModal = () => setShowCreateLobbyModal(true);
  const closeCreateLobbyModal = () => setShowCreateLobbyModal(false);
  const handleSearch = (term) => setSearchTerm(term);

  return (
    <div className="dashboard">
      {/* Sidebar Toggle */}
      <div className={`toggle-sidebar ${showSidebar ? 'visible' : ''}`} onClick={toggleSidebar}>
        {showSidebar ? '<' : '>'}
      </div>

      {/* Personal Sidebar */}
      <PersonalSidebar isVisible={showSidebar} />

      {/* Top Bar with Search and Buttons */}
      <div className="top-bar">
        <SearchBar onSearch={handleSearch} />
        <button className="action-btn" onClick={() => console.warn('Join functionality not implemented')}>Join Lobby/Channel</button>
        <button className="action-btn" onClick={openCreateLobbyModal}>Create Lobby/Channel</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <LobbyList lobbies={lobbies} filter={searchTerm} />
      </div>

      {/* Friends List Toggle */}
      <div className={`toggle-friends ${showFriendsList ? 'visible' : ''}`} onClick={toggleFriendsList}>
        {showFriendsList ? '>' : '<'}
      </div>

      {/* Friends List */}
      <FriendsList isVisible={showFriendsList} />

      {/* Create Lobby Modal */}
      <CreateLobbyModal 
        isVisible={showCreateLobbyModal}
        onClose={closeCreateLobbyModal}
        onCreate={handleCreateLobby}
      />
    </div>
  );
};

export default Dashboard;
