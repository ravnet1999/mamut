import React, { useEffect} from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNotesContext } from '../../Contexts/TaskNotesContext';
import TaskNoteHandler from '../../Handlers/TaskNoteHandler';

const TaskNotes = (props) => {
    const { 
      task,
      notes, setNotes
    } = props;
    
    useEffect(() => {
      if(!task) return;
  
      TaskNoteHandler.getByTaskId(task.id).then(result => {
        console.log('resources', result.resources);
        setNotes(result.resources);  
      });
    }, [task]);

    return (
      <>
      {task.id}
      </>
    );
}

export default WithContexts(TaskNotes, [TaskNotesContext]);