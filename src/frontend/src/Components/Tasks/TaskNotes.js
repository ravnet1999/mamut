import React, { useEffect} from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNotesContext } from '../../Contexts/TaskNotesContext';

const TaskNotes = (props) => {
    const { 
      task,
      notesType, setNotesType, 
      notesTypesChecked, setNotesTypesChecked, 
      notesTypeChecked, setNotesTypeChecked, 
      notes, setNotes, 
      notesModified, setNotesModified,
      notesKey, setNotesKey,
      modifyNote,
      chooseNotesType,
      buildNote
    } = props;
    
    useEffect(() => {
      if(!task) return () => {

      };
      // TaskHandler.updateNote(task.id, appState.note, appState.salesDepNoteChecked).then((result) => {
      //     setNoteModified(false);
      // }).catch((err) => {
      //     console.log(err);
      // })
    }, [notesModified]);



    return (
      <>
      {[...Array(10)].map((x, i) =>
        buildNote(i, notesKey)
      )}
      </>
    );
}

export default WithContexts(TaskNotes, [TaskNotesContext]);