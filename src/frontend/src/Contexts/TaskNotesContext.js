import React, {createContext, useState } from 'react';

export const TaskNotesContext = createContext();

const TaskNotesContextProvider = ({children}) => {
  const [notes, setNotes] = useState([]);
  const [noteTypes, setNoteTypes] = useState({});
  const [notesDownloading, setNotesDownloading] = useState(false); 
  const [noteTypesDownloading, setNoteTypesDownloading] = useState(false); 

  const updateNote = note => {
    let newNotes = notes.map(oldNote => oldNote.id == note.id ? note : oldNote);
    setNotes(newNotes);
  }

  const removeNote = noteId => {
    let newNotes = notes.filter(oldNote => oldNote.id != noteId);    
    setNotes(newNotes);
  }

  return (
    <TaskNotesContext.Provider value={{ 
      notes, setNotes, 
      noteTypes, setNoteTypes,
      notesDownloading, setNotesDownloading,
      noteTypesDownloading, setNoteTypesDownloading,
      updateNote, removeNote
    }}>
      {children}
    </TaskNotesContext.Provider>
  );
}

export default TaskNotesContextProvider;