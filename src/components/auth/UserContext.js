import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, database } from '../../Firebase/firebase';
import { ref, get } from 'firebase/database';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Loading state to track auth readiness

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const usernameRef = ref(database, `usernames/${user.uid}`);
                get(usernameRef).then((snapshot) => {
                    const username = snapshot.exists() ? snapshot.val() : user.email;
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email,
                        name: username
                    });
                }).catch(error => {
                    console.error("Error fetching username:", error);
                }).finally(() => {
                    setLoading(false);  // Set loading to false once user is fetched
                });
            } else {
                setCurrentUser(null);
                setLoading(false);  // Set loading to false even if no user
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, loading, setUser: setCurrentUser }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
