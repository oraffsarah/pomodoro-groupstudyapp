import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const AddTask = () => {
    const [user] = useAuthState(auth);

    const { uid, displayName, photoURL } = auth.currentUser;
    const [task, setTask] = useState("");

    const addTask = async (event) => {
        event.preventDefault();
        if (task.trim() === "") {
            alert("Enter valid task");
            return;
        }
        await addDoc(collection(db, "tasks"), {
            text: task,
            name: displayName,
            createdAt: serverTimestamp(),
            uid,
        });
        setTask("");
    };

    return (
        <>
        <p>addtask running...</p>
        <form onSubmit={(event) => addTask(event)} className="add-task">
            <label htmlFor="taskInput" hidden>
            Enter Task
            </label>
            <input
                id="taskInput"
                name="taskInput"
                type="text"
                className="form-input__input"
                placeholder="set task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit">Send</button>
        </form>
        </>
    );
}

export default AddTask;