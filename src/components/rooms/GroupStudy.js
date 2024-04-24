import { Chat } from "./Chat.js";
import { Tasks } from "./Tasks.js";
import { Notes } from "./Notes.js";
import { GroupTimer } from "./GroupTimer.js";

import './styles/GroupStudy.css';

export const GroupStudy = (props) => {

    const { room } = props;

    return (
        <>
            <div className="groupPage-container">
                <div className="timer-div">
                    <GroupTimer room={room}/>
                </div>
                <div className="tasks-div">
                    Tasks
                    <Tasks room={room}/>
                </div>
                <div className="chat-div">
                    <Chat room={room}/>
                </div>
                <div className="notes-div">
                    <Notes lobby ={room}/>
                </div>
            </div>
        </>
    );
}