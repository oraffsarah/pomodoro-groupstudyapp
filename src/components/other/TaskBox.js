import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import Task from "./Task";
import AddTask from "./AddTask";

const TaskBox = () => {
    const [tasks, setTasks] = useState([]);
  
    useEffect(() => {
      const q = query(
        collection(db, "tasks"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
  
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedTasks = [];
        QuerySnapshot.forEach((doc) => {
          fetchedTasks.push({ ...doc.data(), id: doc.id });
        });
        const sortedTasks = fetchedTasks.sort(
          (a, b) => a.createdAt - b.createdAt
        );
        setTasks(sortedTasks);
      });
      return () => unsubscribe;
    }, []);
  
    return (
        <>
      <main className="task-box">
        <div className="task-wrapper">
          {tasks?.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
        <AddTask />
      </main>
      </>
    );
  };
  
  export default TaskBox;