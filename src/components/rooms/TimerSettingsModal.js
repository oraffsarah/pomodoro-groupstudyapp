import React from 'react';

const TimerSettingsModal = ({
    onClose,
    studyDuration, setStudyDuration,
    shortBreakDuration, setShortBreakDuration,
    longBreakDuration, setLongBreakDuration,
    sessionsBeforeLongBreak, setSessionsBeforeLongBreak,
    autoStartStudy, setAutoStartStudy,
    autoStartBreak, setAutoStartBreak,
    resetSessionCount
}) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Timer Settings</h2>
                <form onSubmit={e => e.preventDefault()}>
                    <label>
                        Study Duration (minutes):
                        <input type="number" value={studyDuration / 60000} onChange={e => setStudyDuration(e.target.value * 60000)} min="1" />
                    </label>
                    <label>
                        Short Break Duration (minutes):
                        <input type="number" value={shortBreakDuration / 60000} onChange={e => setShortBreakDuration(e.target.value * 60000)} min="1" />
                    </label>
                    <label>
                        Long Break Duration (minutes):
                        <input type="number" value={longBreakDuration / 60000} onChange={e => setLongBreakDuration(e.target.value * 60000)} min="1" />
                    </label>
                    <label>
                        Sessions before Long Break:
                        <input type="number" value={sessionsBeforeLongBreak} onChange={e => setSessionsBeforeLongBreak(parseInt(e.target.value, 10))} min="1" />
                    </label>
                    <label>
                        <input type="checkbox" checked={autoStartStudy} onChange={() => setAutoStartStudy(!autoStartStudy)} />
                        Auto-start Study Timer
                    </label>
                    <label>
                        <input type="checkbox" checked={autoStartBreak} onChange={() => setAutoStartBreak(!autoStartBreak)} />
                        Auto-start Break Timer
                    </label>
                    <button type="button" onClick={resetSessionCount}>Reset Study Count</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default TimerSettingsModal;
