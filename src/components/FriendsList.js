import React, { useState, useEffect } from 'react';
import './FriendsList.css';
import { database } from '../Firebase/firebase';
import { ref, onValue, set, remove, get } from 'firebase/database';
import { auth } from '../Firebase/firebase';

const FriendsList = ({ isVisible, onOpenChatModal }) => {
    const [friends, setFriends] = useState([]);
    const [searchTermExisting, setSearchTermExisting] = useState('');
    const [searchTermNew, setSearchTermNew] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [isRequestVisible, setIsRequestVisible] = useState(false);
    const [isFindFriendsVisible, setIsFindFriendsVisible] = useState(false);
    const [isFriendsListVisible,setFriendsListVisible] = useState(false);
    // Fetch all usernames once and store them
    useEffect(() => {
        const usernamesRef = ref(database, 'usernames');
        onValue(usernamesRef, snapshot => {
            const data = snapshot.val() || {};
            const userList = Object.entries(data).map(([uid, username]) => ({
                uid,
                name: username
            }));
            setAllUsers(userList);
        });
    }, []);

    // Fetch friends and friend requests based on changes to allUsers
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const friendsRef = ref(database, `friends/${currentUser.uid}`);
            const requestsRef = ref(database, `friendRequests/${currentUser.uid}`);

            onValue(friendsRef, snapshot => {
                const data = snapshot.val() || {};
                const friendList = Object.keys(data).map(key => ({
                    uid: key,
                    name: allUsers.find(user => user.uid === key)?.name || "Unknown User"
                }));
                setFriends(friendList);
            });

            onValue(requestsRef, snapshot => {
                const data = snapshot.val() || {};
                const requestList = Object.keys(data).map(key => ({
                    uid: key,
                    name: allUsers.find(user => user.uid === key)?.name || "Unknown User"
                }));
                setFriendRequests(requestList);
            });
        }
    }, [allUsers]);

    const handleAddFriend = user => {
        const currentUser = auth.currentUser;
        if (!currentUser || friends.some(friend => friend.uid === user.uid)) {
            alert(`${user.name} is already your friend.`);
            return;
        }
        const currentUsername = allUsers.find(u => u.uid === currentUser.uid)?.name;
        if (currentUsername) {
            set(ref(database, `friendRequests/${user.uid}/${currentUser.uid}`), currentUsername);
        } else {
            console.error("Current user's username not found");
            alert("Your username could not be found. Please update your profile.");
        }
    };

    const handleRemoveFriend = uid => {
        const currentUser = auth.currentUser;
        remove(ref(database, `friends/${currentUser.uid}/${uid}`));
    };

    const handleAcceptFriendRequest = request => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.error("No current user data available");
            return;
        }
        const currentUsername = allUsers.find(u => u.uid === currentUser.uid)?.name;
        const requestUsername = allUsers.find(u => u.uid === request.uid)?.name;
    
        if (currentUsername && requestUsername) {
            set(ref(database, `friends/${currentUser.uid}/${request.uid}`), requestUsername);
            set(ref(database, `friends/${request.uid}/${currentUser.uid}`), currentUsername);
            remove(ref(database, `friendRequests/${currentUser.uid}/${request.uid}`));
        } else {
            console.error("Failed to find usernames for users involved in the friend request.");
            alert("Failed to complete friend request due to username issues.");
        }
    };

    const handleRejectFriendRequest = uid => {
        const currentUser = auth.currentUser;
        remove(ref(database, `friendRequests/${currentUser.uid}/${uid}`));
    };

    const handleSearchExisting = e => {
        setSearchTermExisting(e.target.value.toLowerCase());
    };

    const handleSearchNew = e => {
        const value = e.target.value.toLowerCase();
        setSearchTermNew(value);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        const newPotentialFriends = allUsers.filter(user =>
            user.name.toLowerCase().includes(value) &&
            !friends.some(friend => friend.uid === user.uid));
        setSearchResults(newPotentialFriends);
    };

    return (
        
        <div className={`friends-list ${isVisible ? 'visible' : ''}`}>
            <h2 display-4>Friends</h2>
            <button className="btn btn-info btn-lg mb-3 mt-3" onClick={() => setIsFindFriendsVisible(!isFindFriendsVisible)}>
            Friends List
        </button>
        {isFindFriendsVisible && (
            <>
            <input
            className='form-control'
                type="text"
                placeholder="Search existing friends"
                value={searchTermExisting}
                onChange={handleSearchExisting}
            />
            <div className="friends-container">
                {friends.filter(friend => friend.name.toLowerCase().includes(searchTermExisting)).map((friend) => (
                    <div key={friend.uid} className="friend-item">
                        {friend.name}
                        <button onClick={() => onOpenChatModal(friend)}>M</button>
                        <button onClick={() => handleRemoveFriend(friend.uid)}>R</button>
                    </div>
                ))}
            

            </div>
            </>
        )}

            {/* friend request section, by clicking button you bring dropdown of friend requests */}
            <button className="btn btn-info btn-lg mb-3 mt-3" onClick={() => setIsRequestVisible(!isRequestVisible)}>
            Friend Requests
        </button>

            {isRequestVisible && (
                <>
                <p>Test, Friend requests here</p>
            {friendRequests.map((request) => (
                <div key={request.uid} className="friend-request">
                    {request.name}
                    <button onClick={() => handleAcceptFriendRequest(request)}>Accept</button>
                    <button onClick={() => handleRejectFriendRequest(request.uid)}>Reject</button>
                    
                </div>
            ))}
            </>
        )}


<button className="btn btn-info btn-lg mb-3 mt-3" onClick={() => setIsFindFriendsVisible(!isFindFriendsVisible)}>
            Find New Friends
        </button>
        
        {isFindFriendsVisible && (
            <>
            <input
            className='form-control'
                type="text"
                placeholder="Search new friends"
                value={searchTermNew}
                onChange={handleSearchNew}
            />
            <ul>
                {searchResults.map((user) => (
                    <li key={user.uid}>
                        {user.name}
                        <button onClick={() => handleAddFriend(user)}>Add</button>
                    </li>
                ))}
            </ul>
            </>
    )}


        </div>
    );
};

export default FriendsList;