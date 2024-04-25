import { useState, useEffect } from "react";
import { getDatabase, get, ref, set, onValue } from "firebase/database";
import './styles/Notes.css';

export const Notes = (props) => {
    const db = getDatabase();
    const { lobby } = props;

  // State to store and update the content of the note
    const [noteContent, setNoteContent] = useState("");

    console.log(`lobbies/${ lobby }/content`)

    const noteContentRef = ref(db, `lobbies/${ lobby }/notes/content`);

    // useEffect to set note content as stored text
    useEffect(() => {
        onValue(noteContentRef, (snapshot) => {
            const text = snapshot.val();
            setNoteContent(text.noteContent);
        })
        return () => {
            console.log("lobby closed!");
        };
    }, []);

    // Function to handle changes to the note's content. Updates the noteContent state and firebase
    const handleNoteChange = (event) => {
        setNoteContent(event.target.value);

        set(ref(db, `lobbies/${ lobby }/notes`), {
            content: {noteContent}
        });
    };

    return (
        <div className="personal-notes">
            <h5>Group Notes</h5>
            <textarea value={noteContent} onChange={handleNoteChange} onBlur={handleNoteChange}>
            </textarea>
        </div>
    );

}