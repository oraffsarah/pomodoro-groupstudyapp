import React, { useState, useEffect } from 'react';
import './LobbyList.css';
import { ref, onValue, getDatabase } from 'firebase/database';
import { app } from '../Firebase/firebase';
import unFaveStarIcon from '../image/unFaveStar.png';
import faveStarIcon from '../image/faveStar.png';
import useRoomManager from './rooms/useRoomManager';
import { addFavoriteLobby, removeFavoriteLobby, fetchFavoriteLobbies } from '../Firebase/FirestoreServices';
import { useUser } from './auth/UserContext';  // Ensure correct import path

const LobbyList = ({ filter }) => {
  const { currentUser } = useUser();
  const [lobbies, setLobbies] = useState([]);
  const [showPrivate, setShowPrivate] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [ascending, setAscending] = useState(true);
  const [favorites, setFavorites] = useState([]);
  
  const { addUserToRoom } = useRoomManager();

  const fetchLobbies = () => {
    const database = getDatabase(app);
    const lobbyRef = ref(database, 'lobbies');
    onValue(lobbyRef, snapshot => {
      const lobbiesData = snapshot.val();
      const lobbiesList = lobbiesData ? Object.keys(lobbiesData).map(key => ({
        ...lobbiesData[key],
        id: key,
        currentUsersCount: lobbiesData[key].currentUsers ? Object.keys(lobbiesData[key].currentUsers).length : 0
      })) : [];
      setLobbies(lobbiesList);
    });
  };

  // Fetch favorites from Firestore on user change
  useEffect(() => {
    if (currentUser) {
      fetchFavoriteLobbies(currentUser.uid).then(favLobbies => {
        const favoriteIds = favLobbies.map(lobby => lobby.id);
        setFavorites(favoriteIds);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    fetchLobbies();
  }, []);

  // Updated toggle favorite to handle Firestore
  const toggleFavorite = async (id) => {
    if (favorites.includes(id)) {
      await removeFavoriteLobby(currentUser.uid, id);
      setFavorites(favs => favs.filter(favId => favId !== id));
    } else {
      await addFavoriteLobby(currentUser.uid, id);
      setFavorites(favs => [...favs, id]);
    }
  };

  const handleJoinLobby = (roomId) => {
    addUserToRoom(roomId); // Use RoomManager to add user to room
  };

  const getFilteredAndSortedLobbies = () => {
    return lobbies
      .filter(lobby => showPrivate || !lobby.isLocked)
      .filter(lobby => !showOnlyFavorites || favorites.includes(lobby.id))
      .filter(lobby => lobby.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (favorites.includes(a.id) !== favorites.includes(b.id)) {
          return favorites.includes(b.id) ? 1 : -1;
        }
        if (sortBy === 'name') {
          return ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'currentUsers') {
          return ascending ? a.currentUsersCount - b.currentUsersCount : b.currentUsersCount - a.currentUsersCount;
        }
        return 0;
      });
  };

  return (
    <div>
      <div className="lobby-filters">
        <label>
          <input
            type="checkbox"
            checked={showPrivate}
            onChange={() => setShowPrivate(!showPrivate)}
          /> Show Private Lobbies
        </label>
        <label>
          <input type="checkbox" checked={showOnlyFavorites} onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
          /> Show Favourited Lobbies
        </label>
        <button onClick={() => setSortBy('name')}>Sort by Name</button>
        <button onClick={() => setSortBy('currentUsers')}>Sort by Users</button>
        <button onClick={() => fetchLobbies()}>Refresh</button>
      </div>
      <div className="lobby-list">
        {getFilteredAndSortedLobbies().map(lobby => (
          <div key={lobby.id} className="lobby-item">
            <img
              src={favorites.includes(lobby.id) ? faveStarIcon : unFaveStarIcon}
              alt="Favorite"
              className="star-icon"
              onClick={() => toggleFavorite(lobby.id)}
            />
            <div className="lobby-details">
              <div className="lobby-header">
                <h3 className="lobby-name" title={lobby.name}>{lobby.name}</h3>
                <p className="lobby-users">{lobby.currentUsersCount}/{lobby.maxUsers} Users</p>
                <p className="lobby-status">{lobby.isLocked ? 'Locked' : 'Public'}</p>
              </div>
              <p className="lobby-description">{lobby.description}</p>
            </div>
            <button className="lobby-join-btn" onClick={() => handleJoinLobby(lobby.id)}>Join</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LobbyList;
