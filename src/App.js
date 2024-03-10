
import './App.css';
import React, {useEffect, useState} from 'react';
import GroupStudy from "./components/GroupStudy";
import NavBar from './components/NavBar';
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import TaskBox from "./components/TaskBox";

import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {

  const [user] = useAuthState(auth);

  return (
    <>
      <div className="App">
        <NavBar />
        {!user ? <Welcome /> : <ChatBox />}
        <hr/>
        {<TaskBox />}
      
    </div>
    </>
  );
  
}

export default App;




