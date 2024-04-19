import React, {useEffect, useState} from 'react';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
//import 'bootstrap/dist/scc/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { addData } from './firestoreService';


function Reg() {
    // const [user] = useAuthState(auth);
    const [data, setData] = useState(0);

    function onUserNameChange(event) {
        let data = {
            userId: "aaaaaaaa",
            username: "test"
        }
        setUserName(event.target.value);
    }

    function Submit() {
        let data = {
            username: "test"
        }
        addData(data);
    }

    return (
        <section>
            User Name:
            <input onChange={onUserNameChange} type="text"/>
            <button onClick={Submit} className='btn btn-secondary'>Submit</button>
        </section>
    )
}

export default Reg;