import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { ref, onValue, push, getDatabase } from 'firebase/database';
import { app } from '../../Firebase/firebase';

// Import all components
import SearchBar from '../SearchBar';
import LobbyList from '../LobbyList';
import FriendsList from '../FriendsList';
import PersonalSidebar from '../PersonalSidebar';
import CreateLobbyModal from '../CreateLobbyModal';
import ChatModal from '../ChatModal';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showCreateLobbyModal, setShowCreateLobbyModal] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [selectedFriendForChat, setSelectedFriendForChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    const database = getDatabase(app);
    const lobbyRef = ref(database, 'lobbies');

    onValue(lobbyRef, snapshot => {
      const lobbiesData = snapshot.val();
      const lobbiesList = lobbiesData ? Object.keys(lobbiesData).map(key => ({
        ...lobbiesData[key],
        id: key,
      })) : [];
      setLobbies(lobbiesList);
    });
  }, []);

  // UPDATE FOR FIREBASE
  const [currentUser, setCurrentUser] = useState({
    uid: 'user123',
    name: 'Current User'
  });

  const handleCreateLobby = (newLobby) => {
    const database = getDatabase(app);
    push(ref(database, 'lobbies'), newLobby);
    setShowCreateLobbyModal(false);
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleFriendsList = () => setShowFriendsList(!showFriendsList);
  const openCreateLobbyModal = () => setShowCreateLobbyModal(true);
  const closeCreateLobbyModal = () => setShowCreateLobbyModal(false);

  const handleOpenChatModal = (friend) => {
    setSelectedFriendForChat(friend);
    setIsChatModalVisible(true);
  };

  const handleCloseChatModal = () => {
    setIsChatModalVisible(false);
    setSelectedFriendForChat(null);
  };

  const handleSearch = (term) => setSearchTerm(term);

  return (
    <div className="dashboard">
      <div className={`toggle-sidebar ${showSidebar ? 'visible' : ''}`} onClick={toggleSidebar}>
        {showSidebar ? '<' : '>'}
      </div>

      <PersonalSidebar isVisible={showSidebar} />

      <div className="top-bar">
        <SearchBar onSearch={handleSearch} />
        <button className="action-btn" onClick={() => console.warn('Join functionality not implemented')}>Statistics</button>
        <button className="action-btn" onClick={() => console.warn('Join functionality not implemented')}>Join Lobby/Channel</button>
        <button className="action-btn" onClick={openCreateLobbyModal}>Create Lobby/Channel</button>
      </div>

      <div className="main-content">
        <LobbyList lobbies={lobbies} filter={searchTerm} />
      </div>

      <div className={`toggle-friends ${showFriendsList ? 'visible' : ''}`} onClick={toggleFriendsList}>
        {showFriendsList ? '>' : '<'}
      </div>

      <FriendsList isVisible={showFriendsList} onOpenChatModal={handleOpenChatModal} />

      <CreateLobbyModal isVisible={showCreateLobbyModal} onClose={closeCreateLobbyModal} onCreate={handleCreateLobby} />

      {isChatModalVisible && <ChatModal
  isVisible={isChatModalVisible}
  onClose={handleCloseChatModal}
  friend={selectedFriendForChat}
  currentUser={currentUser} // Pass the currentUser here
/>}
    </div>
  );
};

export default Dashboard;
