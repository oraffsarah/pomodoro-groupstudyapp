import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';


const PomodoroTimer = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [sessionType, setSessionType] = useState('focus'); // 'focus' or 'break'
    const [timeLeft, setTimeLeft] = useState(25 * 60); // default to 25 minutes
    const [focusInterval, setFocusInterval] = useState(25 * 60);
    const [breakInterval, setBreakInterval] = useState(5 * 60);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft === 0) {
                        const nextSessionType = sessionType === 'focus' ? 'break' : 'focus';
                        const nextTimeLeft = nextSessionType === 'focus' ? focusInterval : breakInterval;
                        setSessionType(nextSessionType);
                        return nextTimeLeft;
                    } else {
                        return prevTimeLeft - 1;
                    }
                });
            }, 1000);
        } else if (!isRunning && timeLeft !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, sessionType, focusInterval, breakInterval]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSessionType('focus');
        setTimeLeft(focusInterval);
    };

    // Format timeLeft into mm:ss format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className='container text-center'>

                {
                    //emphasises the heading, if you dont like the colours just chnage/remove them, it chaages color depending on break or study
                }

                <h2 className={`display-4 ${sessionType === 'focus' ? 'text-success' : 'text-warning'}`}> 
            {sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session
        </h2>


            <p className='lead fs-1'>{formatTime(timeLeft)}</p>

            
        
                {
                    //The colour of the start/stop button changes
                    //depending on if isRunning is true
                }
               <div className="d-flex justify-content-center align-items-center mb-3">
            <button className={`btn ${isRunning ? ' btn btn-outline-danger' : 'btn btn-success'} me-2 `} onClick={handleStartStop}>
                {isRunning ? 'Stop' : 'Start'}
            </button>


            {isRunning && <button className='btn btn-secondary me-2 ' onClick={handlePause}>
                Pause
                </button>}


            <button className='btn btn-info ' onClick={handleReset}>
                Reset
                </button>
            <div>
                </div>
                </div>
            
               

                <div className='mt-5'>
                    <div className='mt-5'>
                <label className='form-label'>
                    Focus Interval (mins):
                    <input
                         className="form-control mb-3"
                        type="number"
                        value={focusInterval / 60}
                        onChange={(e) => setFocusInterval(e.target.value * 60)}
                        min="1"
                    />
                </label>
                </div>

                <div>
                <label>
                    Break Interval (mins):
                    <input
                    className="form-control mb-3"
                        type="number"
                        value={breakInterval / 60}
                        onChange={(e) => setBreakInterval(e.target.value * 60)}
                        min="1"
                    />
                </label>
                </div>
            </div>
            </div>
        
        
    );
};

export default PomodoroTimer;
