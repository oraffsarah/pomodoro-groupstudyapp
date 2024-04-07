import React from "react";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Task = ({ task }) => {
    const [user] = useAuthState(auth);
    return (
      <>
      <div
        className={`chat-bubble ${task.uid === user.uid ? "right" : ""}`}>
        <div>
          <p className="user-name">{task.name}: {task.text}</p>
        </div>
      </div>
      </>
    );
  };
  
  export default Task;