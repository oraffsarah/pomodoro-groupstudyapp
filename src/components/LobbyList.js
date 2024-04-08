import React, { useState, useEffect } from 'react';
import './LobbyList.css';
import { ref, onValue, getDatabase } from 'firebase/database';
import { app } from '../Firebase/firebase';
import unFaveStarIcon from '../image/unFaveStar.png';
import faveStarIcon from '../image/faveStar.png';

const LobbyList = ({ filter }) => {
  const [lobbies, setLobbies] = useState([]);
  const [showPrivate, setShowPrivate] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [ascending, setAscending] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const fetchLobbies = () => {
    const database = getDatabase(app);
    const lobbyRef = ref(database, 'lobbies');
    onValue(lobbyRef, snapshot => {
      const lobbiesData = snapshot.val();
      const lobbiesList = lobbiesData
        ? Object.keys(lobbiesData).map(key => ({
            ...lobbiesData[key],
            id: key,
          }))
        : [];
      setLobbies(lobbiesList);
    });
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  const handleRefresh = () => {
    fetchLobbies(); // Refresh the lobbies
  };

  const toggleFavorite = (id) => {
    setFavorites(currentFavorites =>
      currentFavorites.includes(id)
        ? currentFavorites.filter(favId => favId !== id)
        : [...currentFavorites, id]
    );
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
          return ascending ? a.currentUsers - b.currentUsers : b.currentUsers - a.currentUsers;
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
        <button onClick={handleRefresh}>Refresh</button>
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
                <p className="lobby-users">{lobby.currentUsers}/{lobby.maxUsers} Users</p>
                <p className="lobby-status">{lobby.isLocked ? 'Locked' : 'Public'}</p>
              </div>
              <p className="lobby-description">{lobby.description}</p>
            </div>
            <button className="lobby-join-btn">Join</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LobbyList;
