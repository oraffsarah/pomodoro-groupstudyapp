import React,{useState} from 'react';
import PomodoroTimer from './PomodoroTimer';
import PersonalNotes from './PersonalNotes';


const PersonalSidebar = ({ isVisible }) => {
//setting is the 

const [isTimerVisible,setIsTimerVisible] = useState(false);
const [isNotesVisible,setIsNotesVisible] = useState(false);
const [isFavLobbiesVisible,setIsFavLobbiesVisible] = useState(false);

  return (
    <div className={`personal-sidebar ${isVisible ? 'visible' : ''}`}>

      <h2 className='display-4 mb-5'>Study Tools</h2>

      
      <button className="btn btn-info btn-lg" onClick={() => setIsTimerVisible(!isTimerVisible)}>
      Pomodoro Timer
        </button>
      <div className='mb-5'>
       {isTimerVisible && <PomodoroTimer/>}
      </div>

      <div className="mb-5">
        <button className='btn btn-info btn-lg' onClick={ () => setIsNotesVisible(!isNotesVisible)}>Personal Notes</button>
        {isNotesVisible && <PersonalNotes/>}
      </div>  

      <div className="mb-5">
        <button className='btn btn-info btn-lg' onClick={ () => setIsFavLobbiesVisible(!isFavLobbiesVisible)}>Favorited Lobbies</button>
        {isFavLobbiesVisible && <p>Fav Lobbies goes here i would assume,Test</p>}

      </div>  


    </div>
  );
};

export default PersonalSidebar;
