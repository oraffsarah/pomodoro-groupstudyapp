import { useState } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import '../styles/Tasks.css';

export const Timer = (props) => {
    // const db = getDatabase();
    // const { room } = props;
    
    // set(ref(db, 'lobbies/-NsjXLr-Q_pMBuXD3Uyu/timer'), {
    //     startAt: Date.now(),
    //     endAt: Date.now() + 600*1000,
    //     timerOn: false
    // });

    // let serverTimeOffset = 0;
    // onValue(ref(db, 'lobbies/-NsjXLr-Q_pMBuXD3Uyu/timer/serverOffset'), (snapshot) => {
    //     serverTimeOffset = snapshot.val();
    // });

    // const [timeLeft, setTimeLeft] = useState(0);

    // // onValue(ref(db, 'lobbies/-NsjXLr-Q_pMBuXD3Uyu/timer'), (snapshot) => {
        
    // //     const interval = setInterval(() => {
    // //         startTimer(snapshot, interval);
    // //         // const seconds = snapshot.val().seconds;
    // //         // const startAt = snapshot.val().startAt;
    // //         // const timerOn = snapshot.val().timerOn;
    // //         // let amountToSubtract = 0; 
    // //         // if (timerOn) { if(Date.now() >= startAt && timerOn){
    // //         //     amountToSubtract = Date.now() - startAt - serverTimeOffset; 
    // //         // } else { 
    // //         //     amountToSubtract = Date.now() + serverTimeOffset - startAt;
    // //         // } 
    // //         // }
    // //         // const remainingTime = (seconds * 1000) - amountToSubtract;
    // //         // // console.log(remainingTime)
    // //         // if (remainingTime < 0) {
    // //         //   clearInterval(interval);
    // //         //   //play sound
    // //         // } else {
    // //         //   setTimeLeft(remainingTime);
    // //         // }
    // //     }, 1000);
    
    // // });

    // // function startTimer(snapshot, interval) {
    // //     const seconds = snapshot.val().seconds;
    // //     const startAt = snapshot.val().startAt;
    // //     const timerOn = snapshot.val().timerOn;

    // //     let amountToSubtract = 0; 
    // //     if (timerOn) {
    // //         if(Date.now() >= startAt && timerOn){
    // //             amountToSubtract = Date.now() - startAt - serverTimeOffset; 
    // //         } else { 
    // //             amountToSubtract = Date.now() + serverTimeOffset - startAt;
    // //         } 
    // //     }
    // //     const remainingTime = (seconds * 1000) - amountToSubtract;
            
    // //     if (remainingTime < 0) {
    // //         clearInterval(interval);
    // //         //play sound
    // //     } else {
    // //         setTimeLeft(remainingTime);
    // //     }
    // // }

    // var timeout = setInterval(countDown, 2000);

    // function countDown() {
    //     onValue(ref(db, 'lobbies/-NsjXLr-Q_pMBuXD3Uyu/timer'), (snapshot) => {
    //         const endAt = snapshot.val().endAt;
    //         console.log(Date.now())
    //         setTimeLeft(Math.max(0, endAt - Date.now()));
    //         // console.log("ends: ", endAt)
    //         // console.log("now: ",Date.now())
    //         if ( endAt <= Date.now()) { clearInterval(timeout); console.log("break")}
    //     });
        
    // }

    // // function setTime(remaining) {
    // //     console.log("setting time")
    // //     setTimeLeft(remaining);
    // // }

    // const hours = Math.floor(timeLeft / (1000 * 3600));
    // const minutes = Math.floor(timeLeft / (1000 * 60));
    // const seconds = Math.floor((timeLeft / 1000) % 60);

    // function handleStart() {
    //     console.log("start running")
    //     set(ref(db, 'lobbies/-NsjXLr-Q_pMBuXD3Uyu/timer/timerOn'), true, (error) => {
    //         if (error) {
    //             console.error("Error updating timerOn:", error);
    //         } else {
    //             console.log("Timer started successfully");
    //         }
    //     });
    // }

    // function handleStop() {
    //     console.log("stop running")
    //     set(ref(db, 'lobbies/-NsjXLr-Q_pMBuXD3Uyu/timer/timerOn'), false, (error) => {
    //         if (error) {
    //             console.error("Error updating timerOn:", error);
    //         } else {
    //             console.log("Timer stopped successfully");
    //         }
    //     });
    // }

    // <button onClick={ handleStart }>start</button>
    //     <button onClick={ handleStop }>stop</button>
    //     <p>Time Left: {hours ? hours : 0} hours {minutes ? minutes : 0} minutes {seconds ? seconds : 0} seconds</p>

    return (
        <>
        <div>
            timer
        </div>
        
        </>
    );
}