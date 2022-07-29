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

  const removeNote = (note) => {
    return new Promise((resolve, reject) => {
      if(note.id === 0) {
        resolve();
      }

      axios.delete(`${appConfig.URLs.domain}/notes/${note.id}`, {}, {
          withCredentials: true
      }).then((response) => {
          parseResponse(response).then((response) => {
              resolve(response);
              return;
          }).catch((err) => {
              reject(err);
              return;
          });
      }).catch((err) => {
          reject({
              error: true,
              messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
              resources: []
          });
          return;
      });
    });   
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
      removeNote, updateNoteType
    }}>
      {children}
    </TaskNoteContext.Provider>
  );
}

export default TaskNoteContextProvider;