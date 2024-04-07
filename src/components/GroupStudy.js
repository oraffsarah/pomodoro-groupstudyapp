import { Chat } from "./Chat";
import { Tasks } from "./Tasks.js";
import { Notes } from "./Notes.js";
import { Timer } from "./Timer.js";

import '../styles/GroupStudy.css';

export const GroupStudy = (props) => {

    const { room } = props;

    return (
        <>
            <div className="groupPage-container">
                <div className="timer-div">
                    <Timer room={room}/>
                </div>
                
                <div className="tasks-div">
                    Tasks
                    <Tasks room={room}/>
                </div>
                <div className="chat-div">
                    <Chat room={room}/>
                </div>
                <div className="notes-div">
                    <Notes />
                </div>
                <div className="exit-div">
                    Exit
                </div>
            </div>
        </>
    );
}