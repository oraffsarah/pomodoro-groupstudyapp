import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, dbfirestore } from '../../Firebase/firebase.js';
import './styles/Chat.css';

export const Chat = (props) => {
    const { room } = props;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesRef = collection(dbfirestore, "messages-test");

    useEffect(() => {
        const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    ...data,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate().toLocaleTimeString()  // Convert timestamp to time string
                });
            });

            setMessages(messages);
        });

        return () => unsubscribe();
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room,
        });

        setNewMessage("");
    };

    return (
        <div className="chat-app">
            <div className="messages"> 
                {messages.map((message) => (
                    <div key={message.id} className="message-item">
                        <span className="user">{message.user}:</span>
                        <span className="message-text">{message.text}</span>
                        <span className="timestamp" title={`Sent at: ${message.createdAt}`}>
                            {message.createdAt}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="new-message-form">
                <input className="new-message-input" placeholder="Type message here" onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};