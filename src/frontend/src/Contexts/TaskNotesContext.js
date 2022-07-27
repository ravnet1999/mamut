import React, {createContext, useState } from 'react';

export const TaskNotesContext = createContext();

const TaskNotesContextProvider = ({children}) => {
  const [notes, setNotes] = useState({});
  const [noteTypes, setNoteTypes] = useState({});
  const [notesUploading, setNotesUploading] = useState(false); 

  return (
    <TaskNotesContext.Provider value={{ 
      notes, setNotes, 
      noteTypes, setNoteTypes,
      notesUploading, setNotesUploading
    }}>
      {children}
    </TaskNotesContext.Provider>
  );
}

export default TaskNotesContextProvider;