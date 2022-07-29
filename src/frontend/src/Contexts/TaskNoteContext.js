import React, {createContext, useState } from 'react';
import appConfig from '../Config/appConfig.json';
import axios from 'axios';
import parseResponse from '../Handlers/ApiParser';

export const TaskNoteContext = createContext();

const TaskNoteContextProvider = ({children}) => {
  const [ selectedNote, setSelectedNote ] = useState(null);
  const [ selectedNoteTypes, setSelectedNoteTypes ] = useState([]);

  const noteToNoteTypes = note => {
    return note.typy == "" ? [] : note.typy.split(",").map(function (typ) {        
      return { "id": parseInt(typ.split(";")[0]), "nazwa": typ.split(";")[1] };
    });
  }

  const noteTypeSelected = noteType => selectedNoteTypes.filter(selectedNoteType => {
    return selectedNoteType.id == noteType.id
  }).length > 0;

  const updateNoteWithNoteTypes = (note, noteTypes) => {
    note.typy = noteTypes.length == 0 ? "" : noteTypes.map(noteType => noteType.id + ";" + noteType.nazwa).join(",");
  }

  const updateNoteType = noteType => {
    let newSelectedNoteTypes = selectedNoteTypes;

    if(noteTypeSelected(noteType)) {               
      newSelectedNoteTypes = newSelectedNoteTypes.filter(newSelectedNoteType => newSelectedNoteType.id !== noteType.id);
    } else {         
      newSelectedNoteTypes.push({ "id": noteType.id, "nazwa": noteType.nazwa });
    }
         
    setSelectedNoteTypes(newSelectedNoteTypes);
    updateNoteWithNoteTypes(selectedNote, newSelectedNoteTypes);
  }

  return (
    <TaskNoteContext.Provider value={{
      selectedNote, setSelectedNote,
      selectedNoteTypes, setSelectedNoteTypes,
      noteToNoteTypes,
      noteTypeSelected,
      updateNoteWithNoteTypes,
      updateNoteType
    }}>
      {children}
    </TaskNoteContext.Provider>
  );
}

export default TaskNoteContextProvider;