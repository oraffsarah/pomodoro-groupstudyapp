import React, { useState } from 'react';
import './FriendsList.css';
import mockUsers from '../testing/mockUsers'; // Adjust path as necessary
import ChatModal from './ChatModal'; // Ensure this component is correctly implemented

const FriendsList = ({ isVisible, onOpenChatModal }) => {
    const [friends, setFriends] = useState([]);
    const [searchTermExisting, setSearchTermExisting] = useState('');
    const [searchTermNew, setSearchTermNew] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleAddFriend = (user) => {
        if (!friends.some(friend => friend.uniqueId === user.uniqueId)) {
            setFriends([...friends, user]);
        } else {
            alert(`${user.uniqueId} (${user.name}) is already your friend.`);
        }
    };

    const handleRemoveFriend = (uniqueId) => {
        setFriends(friends.filter(friend => friend.uniqueId !== uniqueId));
    };

    const handleSearchExisting = (e) => {
        setSearchTermExisting(e.target.value.toLowerCase());
    };

    const handleSearchNew = (e) => {
        setSearchTermNew(e.target.value.toLowerCase());
        if (!e.target.value.trim()) {
            setSearchResults([]);
            return;
        }
        const newPotentialFriends = mockUsers.filter(user =>
            user.uniqueId.toLowerCase().includes(e.target.value.toLowerCase()) &&
            !friends.some(friend => friend.uniqueId === user.uniqueId));
        setSearchResults(newPotentialFriends);
    };

    return (
        <div className={`friends-list ${isVisible ? 'visible' : ''}`}>
            <h3>Friends</h3>
            <input
                type="text"
                placeholder="Search existing friends"
                value={searchTermExisting}
                onChange={handleSearchExisting}
            />
            <div className="friends-container">
                {friends.filter(friend => friend.uniqueId.toLowerCase().includes(searchTermExisting)).map((friend) => (
                    <div key={friend.uniqueId} className="friend-item">
                        {friend.name}
                        <button onClick={() => onOpenChatModal(friend)}>M</button>
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveFriend(friend.uniqueId); }}>R</button>
                    </div>
                ))}
            </div>
            <h3>Find New Friends</h3>
            <input
                type="text"
                placeholder="Search new friends"
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
