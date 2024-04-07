import React, { useState, useRef } from "react";
import "./styles/App.css";
import { Auth } from "./components/Auth";
import { signOut } from 'firebase/auth';
import{ auth } from './firebase-config';

import { GroupStudy } from "./components/GroupStudy";

import Cookies from 'universal-cookie';
const cookies = new Cookies()

function App () {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);

  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  if (!isAuth) {
  return (
    <div>
      <Auth setIsAuth={setIsAuth}/>
    </div>
  );
  }

  return (
    <>
      {room ? (
        <div>
          {/* <Chat room={room}/> */}
          <GroupStudy room={room}/>
        </div>
      ) : (
        <div className="room">
          <label>Enter Room ID</label>
          <input ref={roomInputRef}/>
          <button onClick={() => setRoom(roomInputRef.current.value)}> Enter Chat </button>
        </div>
      )}

      {/* <div className="sing-out">
        <button onClick={signUserOut}> Sign Out </button>
      </div> */}
    </>
  );
}

export default App;