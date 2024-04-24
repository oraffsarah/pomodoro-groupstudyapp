import React,{useState, useEffect} from 'react';
import PomodoroTimer from './PomodoroTimer';
import PersonalNotes from './PersonalNotes';
import { useUser } from './auth/UserContext';
import { fetchFavoriteLobbies } from '../Firebase/FirestoreServices';
import useRoomManager from './rooms/useRoomManager';

const PersonalSidebar = ({ isVisible }) => {
  const { currentUser } = useUser();
  const [favLobbies, setFavLobbies] = useState([]);
  const { addUserToRoom } = useRoomManager();

const [isTimerVisible,setIsTimerVisible] = useState(false);
const [isNotesVisible,setIsNotesVisible] = useState(false);
const [isFavLobbiesVisible,setIsFavLobbiesVisible] = useState(false);

useEffect(() => {
  if (currentUser) {
    fetchFavoriteLobbies(currentUser.uid).then(setFavLobbies);
  }
}, [currentUser]);

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
        {isFavLobbiesVisible && (
          <div>
            {favLobbies.map(lobby => (
              <div key={lobby.id} className="fav-lobby-item">
                <h4>{lobby.name} ({lobby.currentUsersCount}/{lobby.maxUsers} Users)</h4>
                <button className="btn btn-primary" onClick={() => addUserToRoom(lobby.id)}>Join</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalSidebar;
