import { useEffect, useCallback } from 'react';
import { getDatabase, ref, set, update, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../auth/UserContext';

const useRoomManager = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Generates a unique room ID
  const generateRoomId = useCallback(() => {
    return Math.random().toString(36).substring(2, 12);
  }, []);

  // Adds a user to a room in the database
  const addUserToRoom = useCallback((roomId) => {
    if (!currentUser) {
      console.error("No user logged in.");
      return;
    }
    const db = getDatabase();
    const roomUserRef = ref(db, `lobbies/${roomId}/currentUsers/`);
    console.log('Adding user to room', roomId);

    update(roomUserRef, { [currentUser.uid]: currentUser.name })
      .then(() => {
        console.log("User added to room successfully!");
        navigate(`/rooms/${roomId}`);
      })
      .catch((error) => {
        console.error("Failed to join room:", error);
      });
  }, [currentUser, navigate]);

  // Removes a user from a room in the database
  const removeUserFromRoom = useCallback((roomId) => {
    if (!currentUser || !roomId) {
      console.error("No user logged in or room ID missing.");
      return;
    }
    console.log(`Attempting to remove user from room: ${roomId}`);
    const db = getDatabase();
    const roomUserRef = ref(db, `lobbies/${roomId}/currentUsers/${currentUser.uid}`);
  
    remove(roomUserRef)
      .then(() => {
        console.log("User removed from room successfully");
        navigate('/dashboard'); // Redirect to the dashboard after leaving the room
      })
      .catch((error) => {
        console.error("Failed to leave room:", error);
      });
  }, [currentUser, navigate]);

  // Automatically clean up when the user is about to leave the page
  useEffect(() => {
    const handleUnload = () => {
      console.log('Handling unload for user:', currentUser);
      if (currentUser?.roomId) {
        removeUserFromRoom(currentUser.roomId);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [currentUser, removeUserFromRoom]);

  const createLobby = useCallback(async ({ name, maxUsers, description, isLocked, password }) => {
    const roomId = generateRoomId();
    const lobbyData = {
      name,
      maxUsers,
      description,
      isLocked,
      roomId
    };

    // Include the password in the lobby data if the lobby is locked
    if (isLocked) {
      lobbyData.password = password;  // Ensure the password is added here
    }

    const db = getDatabase();
    const lobbyRef = ref(db, `lobbies/${roomId}`);

    set(lobbyRef, lobbyData)
      .then(() => {
        console.log('Lobby created successfully with ID:', roomId);
      })
      .catch(error => {
        console.error('Error creating lobby:', error);
      });

    return roomId; // Return the generated room ID for navigation
  }, [generateRoomId]);

  return { addUserToRoom, removeUserFromRoom, createLobby, generateRoomId };
};

export default useRoomManager;
