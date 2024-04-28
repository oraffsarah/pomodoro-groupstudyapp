import { dbfirestore, database } from './firebase';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import {get, ref} from 'firebase/database';

// Add a lobby to user's favorites
export const addFavoriteLobby = async (userId, lobbyId) => {
    await setDoc(doc(dbfirestore, `users/${userId}/favorites`, lobbyId), { lobbyId });
};

// Remove a lobby from user's favorites
export const removeFavoriteLobby = async (userId, lobbyId) => {
    await deleteDoc(doc(dbfirestore, `users/${userId}/favorites`, lobbyId));
};

// Fetch all favorite lobbies of a user
export const fetchFavoriteLobbies = async (userId) => {
    const favsSnapshot = await getDocs(collection(dbfirestore, `users/${userId}/favorites`));
    const lobbyIds = favsSnapshot.docs.map(doc => doc.id);

    // Fetch details for each lobby
    const lobbyPromises = lobbyIds.map(lobbyId => get(ref(database, `lobbies/${lobbyId}`)));
    const lobbyDetails = await Promise.all(lobbyPromises);

    return lobbyDetails.map((snapshot, index) => ({
        id: lobbyIds[index],
        name: snapshot.val().name,
        currentUsersCount: Object.keys(snapshot.val().currentUsers || {}).length,
        maxUsers: snapshot.val().maxUsers
    }));
};