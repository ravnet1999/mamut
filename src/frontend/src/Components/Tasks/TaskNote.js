import React, { useEffect, useState } from 'react';

const TaskNote = (props) => {
    const { 
      note,      
      updateNote
    } = props;

    const [ selectedNote, setSelectedNote ] = useState(null);

    useEffect(() => {
      setSelectedNote(note);       
    }, [note]);

    return (
      selectedNote && <textarea id="task-note" className={'form-control'} value={selectedNote.tresc} onChange={(e) => {
          selectedNote.tresc=e.target.value;
          updateNote(selectedNote);
        }
      }></textarea>
    );
}

export default TaskNote;