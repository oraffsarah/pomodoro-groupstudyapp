import React, { useState, useEffect } from 'react';

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
        <div>
            <h2>{sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session</h2>
            <p>{formatTime(timeLeft)}</p>
            <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
            {isRunning && <button onClick={handlePause}>Pause</button>}
            <button onClick={handleReset}>Reset</button>
            <div>
                <label>
                    Focus Interval (mins):
                    <input
                        type="number"
                        value={focusInterval / 60}
                        onChange={(e) => setFocusInterval(e.target.value * 60)}
                        min="1"
                    />
                </label>
                <label>
                    Break Interval (mins):
                    <input
                        type="number"
                        value={breakInterval / 60}
                        onChange={(e) => setBreakInterval(e.target.value * 60)}
                        min="1"
                    />
                </label>
            </div>
        </div>
    );
};

export default PomodoroTimer;
