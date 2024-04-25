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
                messages.push({...doc.data(), id: doc.id});
            });

            setMessages(messages);
        });

        return () => unsubscribe();
    }, []);

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
            {/* <div className="header"><h1>Welcome to: {room}</h1></div> */}
            <div className="messages"> {messages.map((message) => 
                <div>
                    <span className="user"><b>{message.user}</b></span> { }
                    {message.text}
                </div>
            )}</div>
            <form onSubmit={handleSubmit} className="new-message-form">
                <input className="new-message-input" placeholder="Type message here" onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
}