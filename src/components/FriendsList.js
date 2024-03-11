import React, { useState } from 'react';
import './FriendsList.css';
import mockUsers from '../testing/mockUsers';

const FriendsList = ({ isVisible, onFriendSelect }) => {
  const [friends, setFriends] = useState([]);
  const [searchTermExisting, setSearchTermExisting] = useState('');
  const [searchTermNew, setSearchTermNew] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleAddFriend = (user) => {
    if (!friends.some(friend => friend.uniqueId === user.uniqueId)) {
      setFriends(prevFriends => [...prevFriends, user]);
    } else {
      alert(`${user.uniqueId} (${user.name}) is already your friend.`);
    }
  };

  const handleRemoveFriend = (uniqueId) => {
    setFriends(friends.filter(friend => friend.uniqueId !== uniqueId));
  };

  const handleSearchExisting = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermExisting(value);
  };

  const handleSearchNew = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermNew(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    const newPotentialFriends = mockUsers.filter(user =>
      user.uniqueId.toLowerCase().includes(value) &&
      !friends.some(friend => friend.uniqueId === user.uniqueId));
    setSearchResults(newPotentialFriends);
  };

  const selectFriend = (friend) => {
    console.log("Selected friend: ", friend.name);
    if (onFriendSelect) onFriendSelect(friend);
  };

  return (
    <div className={`friends-list ${isVisible ? 'visible' : ''}`}>
      <h3>Friends</h3>
      <input
        type="text"
        placeholder="Search existing friends by unique ID"
        value={searchTermExisting}
        onChange={handleSearchExisting}
      />
      <div className="friends-container">
        {friends.filter(friend =>
          friend.uniqueId.toLowerCase().includes(searchTermExisting)
        ).map((friend) => (
          <div key={friend.uniqueId} className="friend-item" onClick={() => selectFriend(friend)}>
            {friend.name}
            <button onClick={(e) => {e.stopPropagation(); handleRemoveFriend(friend.uniqueId);}}>R</button>
          </div>
        ))}
      </div>
      <h3>Find New Friends</h3>
      <input
        type="text"
        placeholder="Search new friends by unique ID"
        value={searchTermNew}
        onChange={handleSearchNew}
      />
      <ul>
        {searchResults.map((user) => (
          <li key={user.uniqueId}>
            {`${user.uniqueId} (${user.name})`}
            <button onClick={() => handleAddFriend(user)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
