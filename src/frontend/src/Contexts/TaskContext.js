import React, {createContext, useState } from 'react';
import TaskHandler from '../Handlers/TaskHandler';

export const TaskContext = createContext();

const TaskContextProvider = ({children}) => {
  const [ taskStarted, setTaskStarted ] = useState(false);

  const createTask = (selectedRepId, selectedClientId) => {
    setTaskStarted(true);
    return TaskHandler.createTask(selectedClientId, selectedRepId);    
  }

  return (
    <div>
      <TaskContext.Provider value={{ taskStarted, createTask }} >
        {children}
      </TaskContext.Provider>
    </div>
  );
}

export default TaskContextProvider;