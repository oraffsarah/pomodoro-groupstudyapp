import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase-config.js';
import '../styles/Tasks.css';

export const Tasks = (props) => {
    const { room } = props;
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const tasksRef = collection(db, "tasks");

    useEffect(() => {
        const queryTasks = query(tasksRef, where("room", "==", room), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryTasks, (snapshot) => {
            let tasks = [];
            snapshot.forEach((doc) => {
                tasks.push({...doc.data(), id: doc.id});
            });

            setTasks(tasks);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newTask === "") return;

        await addDoc(tasksRef, {
            text: newTask,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room,
        });

        setNewTask("");
    };

    return (
        <div className="task-app">
            <div className="tasks"> {tasks.map((task) => 
                <div>
                    <span className="user"><b>{task.user}</b></span> { }
                    {task.text}
                </div>
            )}</div>
            <div className="wrapper">
                <div className="demo">
                <form onSubmit={handleSubmit} className="new-task-form">
                    <input className="new-task-input" placeholder="Type task here" onChange={(e) => setNewTask(e.target.value)} value={newTask}/>
                    <button type="submit" className="send-button">Send</button>
                </form>
                </div>
            </div>
        </div>
    );
}