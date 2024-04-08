import React, { useState } from 'react';
import './ChatModal.css';

const ChatModal = ({ isVisible, onClose, friend, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (!newMessage.trim() || !currentUser) return;
        const messageToSend = {
            sender: currentUser.uniqueId, // Assuming currentUser has a uniqueId property
            text: newMessage,
            sentAt: new Date().toISOString()
        };

        setMessages([...messages, messageToSend]);
        setNewMessage('');
    };

    if (!isVisible) return null;

    return (
        <div className={`chat-modal ${isVisible ? 'visible' : ''}`}>
            <div className="chat-header">
                <span>Chat with {friend.name}</span>
                <button onClick={onClose}>Close</button>
            </div>
            <div className="messages-list">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <strong>{message.sender === currentUser.uniqueId ? 'Me' : friend.name}:</strong>
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



/* Temp, possibly working For Firebase
import React, { useState, useEffect } from 'react';
import './ChatModal.css'; // Ensure you have this CSS file for styling
import { database } from '../Firebase/firebase'; // Adjust the import path as needed
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const ChatModal = ({ friend, onClose }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Assuming 'chats' collection exists in the Firestore
    const messagesRef = collection(database, 'chats', friend.id, 'messages');

    useEffect(() => {
        const q = query(messagesRef, orderBy('createdAt'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [friend.id]);

    const sendMessage = async () => {
        if (message.trim() !== '') {
            await addDoc(messagesRef, {
                text: message,
                createdAt: new Date(),
                // Include other relevant fields such as senderId, receiverId
            });
            setMessage(''); // Clear the message input after sending
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
            e.preventDefault();
        }
    };

    return (
        <div className="chat-modal">
            <div className="chat-header">
                <h3>Chat with {friend.name}</h3>
                <button onClick={onClose}>Close</button>
            </div>
            <ul className="messages-list">
                {messages.map((msg) => (
                    <li key={msg.id}>{msg.text}</li>
                ))}
            </ul>
            <div className="message-input">
                <textarea 
                    value={message} 
                    onChange={handleInputChange} 
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatModal;
*/