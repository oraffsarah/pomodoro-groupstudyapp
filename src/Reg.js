import React, {useEffect, useState} from 'react';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function Reg() {
    const [userName, setUserName] = useState(0);

    return (
        <section>
            User Name:
            <input type="text"></input>
        </section>
    )
}

export default Reg;