import { useState, useEffect } from "react";
import { getDatabase, ref, get, set, onValue } from "firebase/database";
// import '../styles/Tasks.css';

export const GroupTimer = (props) => {
    const db = getDatabase();
    const { room } = props;
    
//1. poll timer info from db, boolean val.

    const [timer, setTimer] = useState(false);
    const [duration, setDuration] = useState(70000);

    const timerRef = ref(db, `lobbies/${ room }/timer`);

    useEffect(() => {
        // Listen for changes to the data
        const unsubscribe = onValue(timerRef, (snapshot) => {
            // Get the data from the snapshot
            const timerVal = snapshot.val().timerOn;
            
            // Update the component state with the new data
            setTimer(timerVal);

            if (timerVal) {
                const endVal = snapshot.val().endAt;
                console.log(endVal - Date.now())
                setDuration(endVal - Date.now());
            }
            
        });

        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => {
            unsubscribe(); // Unsubscribe from the listener
        };
    }, []);

//2. handle timerOn (client-side) continually 1sec

    useEffect(() => {
        let interval = null;
        if (timer) {
            interval = setInterval(() => {
                setDuration(prevTime => {
                    if (prevTime <= 0) { // Check if time has reached zero or below
                        clearInterval(interval); // Stop the interval
                        handleStop(); // Stop the timer
                        return 0; // Set time explicitly to zero
                    }
                    return prevTime - 1000;
                });
                
          }, 1000);
        } else {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [timer]);


//3. set time and store locally

    var minutes = Math.max(0,(Math.floor(duration/60000)));
    var seconds = Math.max(0,(Math.floor((duration%60000)/1000)));

//4. handle start, log start and end time to db, set timerOn

    function handleStart() {
        if (duration > 0) {
            set(timerRef, {
                timerOn: true,
                startAt: Date.now(),
                endAt: Date.now() + duration
            });
        }
    }

//5. handle stop, set timerOn false

    function handleStop() {
        const currentData = get(timerRef).then((snapshot) => {

        });
        set(timerRef, {
            ...currentData,
            timerOn: false,
        });
    }
    
    function handleReset() {
        handleStop();
        setDuration(0);
    }

//6. function to log user-input timer duration
    function handleInput() {
        setDuration(prevTime => {
            const mins = document.getElementById("min").value;
            const secs = document.getElementById("sec").value;
            
            let time = mins*60000 + secs*1000;

            return time;
        })
    }

    return (
        <>
            <div>
                {minutes ? (minutes<10 ? '0'+minutes : minutes) : '00'}
                :
                {seconds ? (seconds<10 ? '0'+seconds : seconds) : '00'}
            </div>
            <button onClick={ handleStart }>start</button>
            <button onClick={ handleStop }>pause</button>
            <button onClick={ handleReset }>reset</button>
            <div>
                input timer duration:
                <input type="number" class="form-control" id="min" placeholder='Minutes'></input>
                <input type="number" class="form-control" id="sec" 
                placeholder='Seconds' min="0" max="59"></input>
                <input type="submit" onClick={handleInput}></input>
            </div>
        </>
    );
}