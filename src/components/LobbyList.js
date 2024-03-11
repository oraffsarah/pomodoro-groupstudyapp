import React, { useState, useEffect } from 'react';
import './LobbyList.css';
import { ref, onValue, getDatabase } from 'firebase/database';
import { app } from '../Firebase/firebase';
import unFaveStarIcon from '../image/unFaveStar.png';
import faveStarIcon from '../image/faveStar.png';

const LobbyList = ({ filter }) => {
  const [lobbies, setLobbies] = useState([]);
  const [showPrivate, setShowPrivate] = useState(true);
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
    let filtered = lobbies.filter(lobby => (showPrivate ? true : !lobby.isLocked) && lobby.name.toLowerCase().includes(filter.toLowerCase()));

    // Sorting favorites to the top
    let sorted = filtered.sort((a, b) => {
      return favorites.includes(b.id) - favorites.includes(a.id) || (ascending ? (a[sortBy] < b[sortBy] ? -1 : 1) : (a[sortBy] > b[sortBy] ? -1 : 1));
    });

    return sorted;
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
