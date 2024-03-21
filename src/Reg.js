import React, {useEffect, useState} from 'react';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addData } from './firestoreService';


function Reg() {
    const [user] = useAuthState(auth);
    const [userName, setUserName] = useState(0);

    function onUserNameChange(event) {
        setUserName(event.target.data);
    }

    function Submit() {
        addData(userName);
    }

    return (
        <section>
            User Name:
            <input onChange={onUserNameChange} type="text"></input>
            <button onClick={Submit}>Submit</button>
        </section>
    )
}

export default Reg;