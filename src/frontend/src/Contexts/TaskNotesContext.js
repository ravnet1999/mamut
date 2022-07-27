import React, {createContext, useState } from 'react';

export const TaskNotesContext = createContext();

const TaskNotesContextProvider = ({children}) => {
  const [notes, setNotes] = useState({});
  const [notesUploading, setNotesUploading] = useState(false); 

  return (
    <TaskNotesContext.Provider value={{ 
      notes, setNotes, 
      notesUploading, setNotesUploading
    }}>
      {children}
    </TaskNotesContext.Provider>
  );
}

export default TaskNotesContextProvider;