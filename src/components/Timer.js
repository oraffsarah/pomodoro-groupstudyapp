import { useState, useEffect, state } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { getDatabase, ref, set } from "firebase/database";
// import { auth, db } from '../firebase-config.js';
import '../styles/Tasks.css';
// state = {
//     timerOn: false,
//     //server time of the database
//     timerStart: 0,
//     //from host
//     timerDuration: 0,
//     //relative offset of client to central timer
//     offset: 0,
//     timerEnd: 0
// };

export const Timer = (props) => {
    // const db = getDatabase();
    // const { room } = props;
    // const ref = ref(db, 'lobbies/' + room);
    // ref.set({
    //     startAt: serverTimestamp,
    //     seconds: 20
    // });

    // const serverTimeOffset = 0;
    // db.ref(".info/serverTimeOffset").on("value", (snapshot) => { serverTimeOffset = snapshot.val() });
    // ref.on("value", (snapshot) => {
    //     const seconds = snapshot.val().seconds;
    //     const startAt = snapshot.val().startAt;
    //     const interval = setInterval(() => {
    //         const timeLeft = (seconds * 1000) - (Date.now() - startAt - serverTimeOffset);
    //         if (timeLeft < 0) {
    //           clearInterval(interval);
    //           console.log("0.0 left");
    //         } else {
    //           console.log(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`);
    //         }
    //     }, 100)
    // });


    return (
        <>
        <div>
            timer
        </div>
        </>
    );
}