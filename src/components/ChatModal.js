import React, { useState, useEffect } from 'react';
import './ChatModal.css';
import { dbfirestore } from '../Firebase/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, limit, doc, getDocs } from 'firebase/firestore';
import { useUser } from './auth/UserContext';

const ChatModal = ({ isVisible, onClose, friend }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { currentUser } = useUser(); // Access the currentUser from context

    useEffect(() => {
        console.log("Current user:", currentUser);
        console.log("Friend:", friend);

        if (!currentUser || !friend || !isVisible || !currentUser.uid || !friend.uid) {
            console.error("Missing user details or modal is not visible.", { currentUser, friend });
            return;
        }

        const chatId = currentUser.uid > friend.uid ? `${currentUser.uid}_${friend.uid}` : `${friend.uid}_${currentUser.uid}`;
        console.log("Chat ID:", chatId);

        const messagesRef = collection(dbfirestore, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy("sentAt", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                sentAt: doc.data().sentAt.toDate()
            }));
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, [friend, currentUser, isVisible]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentUser || !friend) {
            console.error("Invalid message or missing user details:", { newMessage, currentUser, friend });
            return;
        }

        const chatId = currentUser.uid > friend.uid ? `${currentUser.uid}_${friend.uid}` : `${friend.uid}_${currentUser.uid}`;
        const messagesRef = collection(dbfirestore, 'chats', chatId, 'messages');

        try {
            const messagesQuery = query(messagesRef, orderBy("sentAt", "asc"), limit(50));
            const snapshot = await getDocs(messagesQuery);
            if (snapshot.docs.length >= 50) {
                await deleteDoc(doc(dbfirestore, 'chats', chatId, 'messages', snapshot.docs[0].id));
            }

            await addDoc(messagesRef, {
                sender: currentUser.uid,
                text: newMessage,
                sentAt: new Date()
            });
            setNewMessage('');
            console.log("Message sent successfully");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`chat-modal ${isVisible ? 'visible' : ''}`}>
            <div className="chat-header">
                <span>Chat with {friend.name || friend.displayName}</span>
                <button onClick={onClose}>Close</button>
            </div>
            <div className="messages-list">
                {messages.map((message) => (
                    <div key={message.id} className="message">
                        <strong>{message.sender === currentUser.uid ? 'Me' : friend.name || friend.displayName}:</strong>
                        <span className="message-content">{message.text}</span>
                        <span className="message-timestamp">{new Date(message.sentAt).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatModal;