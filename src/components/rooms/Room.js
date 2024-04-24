import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, getDatabase } from 'firebase/database';
import { useRoomManagerContext } from './RoomManagerContext';
import { GroupStudy } from './GroupStudy';
// import {GroupStudy} from '../GroupStudy';

const Room = () => {
    const { roomId } = useParams();
    const { removeUserFromRoom } = useRoomManagerContext();
    const [roomName, setRoomName] = useState('');
    const [currentUsers, setCurrentUsers] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const roomRef = ref(db, `lobbies/${roomId}`);

        console.log("Subscribing to room:", roomId);
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const roomData = snapshot.val();
            if (roomData) {
                setRoomName(roomData.name);
                setCurrentUsers(Object.values(roomData.currentUsers || {}));
            } else {
                setRoomName('Room not found');
                setCurrentUsers([]);
            }
        });

        return () => {
            console.log("Cleaning up subscriptions for room:", roomId);
            unsubscribe();
        };
    }, [roomId]);

    // Function to manually leave the room
    const handleLeaveRoom = () => {
        removeUserFromRoom(roomId);
        console.log("Manually leaving the room:", roomId);
    };

    return (
        <div>
            <h1>Room: {roomName}</h1>
            <h2>Current Users:</h2>
            <ul>
            {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => <p key={index}>{user}</p>)
            ) : (
                <p>No users currently in this room.</p>
            )}
            </ul>
            <GroupStudy room={roomId}/>
            <button onClick={handleLeaveRoom}>Leave Lobby</button>
        </div>
    );
};

export default Room;
