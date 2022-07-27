import React, {createContext, useState } from 'react';

export const TaskNotesContext = createContext();

const TaskNotesContextProvider = ({children}) => {
  const [notes, setNotes] = useState({});
  
  return (
    <TaskNotesContext.Provider value={{ 
      notes, setNotes, 
    }}>
      {children}
    </TaskNotesContext.Provider>
  );
}

export default TaskNotesContextProvider;