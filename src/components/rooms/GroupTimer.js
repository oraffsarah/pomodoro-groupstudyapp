import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import TimerSettingsModal from "./TimerSettingsModal";
import './styles/GroupTimer.css';

export const GroupTimer = ({ room }) => {
    const db = getDatabase();
    const timerRef = ref(db, `lobbies/${room}/timer`);

    const [timerOn, setTimerOn] = useState(false);
    const [duration, setDuration] = useState(1500000); // Initial study duration
    const [studyDuration, setStudyDuration] = useState(1500000);
    const [shortBreakDuration, setShortBreakDuration] = useState(300000);
    const [longBreakDuration, setLongBreakDuration] = useState(900000);
    const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
    const [sessionCount, setSessionCount] = useState(0);
    const [isStudyTimer, setIsStudyTimer] = useState(true);
    const [autoStartStudy, setAutoStartStudy] = useState(false);
    const [autoStartBreak, setAutoStartBreak] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const unsubscribe = onValue(timerRef, snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setTimerOn(data.timerOn);
                if (data.timerOn) {
                    const remainingTime = data.endAt - Date.now();
                    setDuration(Math.max(remainingTime, 0));
                }
            } else {
                setTimerOn(false);
                resetTimer();
            }

            const endAt = snapshot.val().endAt;
            if (endAt == -1) {
                resetTimer();
            }
        });
        return () => unsubscribe();
    }, [db, room]);

    useEffect(() => {
        let intervalId;
        if (timerOn && duration > 0) {
            intervalId = setInterval(() => {
                setDuration(prevDuration => Math.max(prevDuration - 1000, 0));
            }, 1000);
        } else if (duration <= 0 && timerOn) {
            handleTimerEnd();
        }
        return () => clearInterval(intervalId);
    }, [timerOn, duration]);

    const handleTimerEnd = () => {
        setTimerOn(false);  // Turn off the timer
        const nextIsStudyTimer = !isStudyTimer;  // Toggle the study/break status
        const shouldStartLongBreak = !nextIsStudyTimer && (sessionCount + 1) % sessionsBeforeLongBreak === 0;
        const nextDuration = nextIsStudyTimer ? studyDuration : (shouldStartLongBreak ? longBreakDuration : shortBreakDuration);

        setIsStudyTimer(nextIsStudyTimer);
        if (!nextIsStudyTimer) {
            // Increment session count if transitioning from study to break
            setSessionCount(current => current + 1);
        }

        // Delay the start of the next timer to avoid rapid state changes
        setTimeout(() => {
            setDuration(nextDuration);
            if ((nextIsStudyTimer && autoStartStudy) || (!nextIsStudyTimer && autoStartBreak)) {
                setTimerOn(true);
            }
        }, 500);  // Slight delay before setting timer on to handle state transition
    };

    const resetTimer = () => {
        const defaultTime = isStudyTimer ? studyDuration : shortBreakDuration;
        setDuration(defaultTime);
        setSessionCount(0);
        setTimerOn(false);
    };

    const handleStartPause = () => {
        if (!timerOn && duration === 0) {
            const resetDuration = isStudyTimer ? studyDuration : (sessionCount % sessionsBeforeLongBreak === 0 ? longBreakDuration : shortBreakDuration);
            setDuration(resetDuration);
        }
        setTimerOn(!timerOn);
        set(timerRef, { timerOn: !timerOn, startAt: Date.now(), endAt: Date.now() + duration });
    };

    const handleReset = () => {
        resetTimer();

        const currentData = get(timerRef).then((snapshot) => {

        });
        set(timerRef, {
            ...currentData,
            timerOn: false,
            endAt: -1,
        });
    };

    const resetSessionCount = () => {
        setSessionCount(0);  // This function now specifically resets the session count
    };

    const onSettingsClose = () => {
        console.log("Settings have been updated.");
        // Immediately apply the new duration settings based on whether it's a study or break timer
        const newDuration = isStudyTimer ? studyDuration : (sessionCount % sessionsBeforeLongBreak === 0 ? longBreakDuration : shortBreakDuration);
        setDuration(newDuration);
        if (timerOn) {
            // If the timer was running, restart it with the new duration
            setTimerOn(false);
            setTimeout(() => {
                setTimerOn(true);
            }, 100);  // Short delay to allow state update
        }
    };

    return (
        <div className="timer-container">
            <button className="config-button" onClick={() => setShowSettings(true)}>Config</button>
            <div className="timer-display">
                <div>{isStudyTimer ? "Study Timer" : "Break Timer"}</div>
                {Math.floor(duration / 60000).toString().padStart(2, '0')}:{Math.floor((duration % 60000) / 1000).toString().padStart(2, '0')}
            </div>
            <div className="groupTimerBtnDiv">
                <button onClick={handleStartPause}>
                    {timerOn ? 'Pause' : 'Start'}
                </button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <div>Study Intervals Completed: {sessionCount}</div>
            {showSettings && <TimerSettingsModal
                onClose={() => {
                    setShowSettings(false);
                    onSettingsClose();
                }}
                studyDuration={studyDuration} setStudyDuration={setStudyDuration}
                shortBreakDuration={shortBreakDuration} setShortBreakDuration={setShortBreakDuration}
                longBreakDuration={longBreakDuration} setLongBreakDuration={setLongBreakDuration}
                sessionsBeforeLongBreak={sessionsBeforeLongBreak} setSessionsBeforeLongBreak={setSessionsBeforeLongBreak}
                autoStartStudy={autoStartStudy} setAutoStartStudy={setAutoStartStudy}
                autoStartBreak={autoStartBreak} setAutoStartBreak={setAutoStartBreak}
                resetSessionCount={resetSessionCount}
            />}
        </div>
    );
};
