import React, { useEffect} from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNotesContext } from '../../Contexts/TaskNotesContext';

const TaskNotes = (props) => {
    const { 
      task
    } = props;
    
    useEffect(() => {      
    }, []);



    return (
      <>
      {task.id}
      </>
    );
}

export default WithContexts(TaskNotes, [TaskNotesContext]);