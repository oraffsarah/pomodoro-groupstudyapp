import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  return (
    <div 
      className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        height = "50px" width = "50px"
        src={message.avatar}
        alt="user avatar"
      /> {message.name}
      <p> {message.text}</p>
      
    </div>
  );
};

export default Message;