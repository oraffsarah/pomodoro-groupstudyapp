import React, { useState, useEffect } from "react";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, onSnapshot, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { auth, dbfirestore } from '../../Firebase/firebase';
import './styles/Tasks.css';

export const Tasks = (props) => {
    const { room } = props;
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const tasksRef = collection(dbfirestore, "tasks");

    useEffect(() => {
        const queryTasks = query(tasksRef, where("room", "==", room), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryTasks, (snapshot) => {
            let tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setTasks(tasks);
        });

        return () => unsubscribe();
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newTask.trim() === "") return;

        await addDoc(tasksRef, {
            text: newTask,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room,
            completed: false // Default completed state
        });

        setNewTask("");
    };

    async function handleDelete(taskId) {
        await deleteDoc(doc(dbfirestore, "tasks", taskId));
    }

    async function toggleCompletion(taskId, completed) {
        await updateDoc(doc(dbfirestore, "tasks", taskId), {
            completed: !completed
        });
    }

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDrop = (e, dropTaskId) => {
        e.preventDefault();
        const draggedTaskId = e.dataTransfer.getData("taskId");
        const tasksCopy = [...tasks];
        const dragIndex = tasksCopy.findIndex(task => task.id === draggedTaskId);
        const dropIndex = tasksCopy.findIndex(task => task.id === dropTaskId);

        const [removedTask] = tasksCopy.splice(dragIndex, 1);
        tasksCopy.splice(dropIndex, 0, removedTask);
        setTasks(tasksCopy);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="task-app">
            <div className="tasks">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                        onClick={() => toggleCompletion(task.id, task.completed)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, task.id)}
                    >
                        <span className="user"><b>{task.user}</b></span>
                        {" "}{task.text}
                        <button className="delete-task-btn" onClick={() => handleDelete(task.id)}>delete</button>
                    </div>
                ))}
            </div>
            <div className="wrapper">
                <form onSubmit={handleSubmit} className="new-task-form">
                    <input
                        className="new-task-input"
                        placeholder="Type task here"
                        onChange={(e) => setNewTask(e.target.value)}
                        value={newTask}
                    />
                    <button type="submit" className="send-button">Send</button>
                </form>
            </div>
        </div>
    );
};
