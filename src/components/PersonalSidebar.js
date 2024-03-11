import React from 'react';
import PomodoroTimer from './PomodoroTimer';
import PersonalNotes from './PersonalNotes';

const PersonalSidebar = ({ isVisible }) => {
  return (
    <div className={`personal-sidebar ${isVisible ? 'visible' : ''}`}>
      <h2>My Study Tools</h2>
      <div className="pomodoro-timer">
        <h3>Pomodoro Timer</h3>
        <PomodoroTimer />
      </div>
      <div className="personal-notes">
        <h3>Personal Notes</h3>
        <PersonalNotes />
      </div>
      <div className="favorite-lobbies">
        <h3>Favorited Lobbies</h3>
        {/* Favorited Lobbies List */}
      </div>
    </div>
  );
};

export default PersonalSidebar;
