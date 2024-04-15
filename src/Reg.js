import React, {useEffect, useState} from 'react';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// import 'bootstrap/dist/scc/bootstrap.css';
// import 'bootstrap/dist/scc/bootstrap.min.css';
//import { addData } from './firestoreService';


function Reg() {
    const [user] = useAuthState(auth);
    const [userName, setUserName] = useState(0);

    function onUserNameChange(event) {
        setUserName(event.target.value);
    }

    function Submit() {
        console.log(userName);
    }

    return (
        <section>
            User Name:
            <input onChange={onUserNameChange} type="text"/>
            <button onClick={Submit} className='btn'>Submit</button>
        </section>
    )
}

export default Reg;