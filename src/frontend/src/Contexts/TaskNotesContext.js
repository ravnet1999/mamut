import React, {createContext, useState } from 'react';
import { Container, Row, Col, Button, Form } from '../Components/bootstrap';
import appConfig from '../Config/appConfig.json';

export const TaskNotesContext = createContext();

const TaskNotesContextProvider = ({children}) => {
  const [notesType, setNotesType] = useState({});
  const [notesTypesChecked, setNotesTypesChecked] = useState({});
  const [notesTypeChecked, setNotesTypeChecked] = useState({});
  const [notes, setNotes] = useState({});
  const [notesModified, setNotesModified] = useState({});
  const [notesKey, setNotesKey] = useState(567);

  const modifyNote = (index, value) => {
    //let newAppState = appState;
    let newNotes = notes;
    newNotes[index] = value;
    //setAppState(newAppState);
    //setNotes(newNotes);

    //if(task && value !== null) {
      let newNotesModified = notesModified;
      newNotesModified[index] = true;
      setNotesModified(newNotesModified);
    //}
  }

  const chooseNotesType = (index, noteType) => {
    // let newAppState = appState;
    let newNotesType = notesType;
    newNotesType[index] = noteType;      
    // newAppState.notesType = newNotesType;

    setNotesType(newNotesType);

    let newNotesTypesChecked = notesTypesChecked;

    if(!newNotesTypesChecked[index]) {
      newNotesTypesChecked[index] = {};
    }

    newNotesTypesChecked[index][noteType] = { type: noteType, checked: !notesTypesChecked[index] || !notesTypesChecked[index][noteType] || !notesTypesChecked[index][noteType].checked };
    setNotesTypesChecked(newNotesTypesChecked);
    
    let newNotesTypeChecked = notesTypeChecked;

    newNotesTypeChecked[index] = Object.entries(newNotesTypesChecked[index])
      .find((notesTypeChecked) => {
        return notesTypeChecked[1].checked == 1;
    });

    newNotesTypeChecked[index] = newNotesTypeChecked[index] && newNotesTypeChecked[index].length >1;

    setNotesTypeChecked(newNotesTypeChecked);
    // newAppState.notesTypeChecked = newNotesTypeChecked;
    
    // setAppState(newAppState);
    setNotesType(newNotesType);
    
    setNotesKey(Math.random().toString(36)); 
  }

  const buildNote = (index, notesKey) => {
    return (
    <Col key={notesKey + index} xs="12" md="4" >
      <div className="form-group task-note-container margin-bottom-default">
          <Form.Check inline label={appConfig.noteTypes.salesDepNoteType.label} type="checkbox" id="note-type" onChange={(e) => chooseNotesType(index, appConfig.noteTypes.salesDepNoteType.id)} checked={notesTypesChecked[index] && notesTypesChecked[index][appConfig.noteTypes.salesDepNoteType.id] && notesTypesChecked[index][appConfig.noteTypes.salesDepNoteType.id].checked}></Form.Check>
          <Form.Check inline label={appConfig.noteTypes.otherNoteType.label} type="checkbox" id="note-type" onChange={(e) => chooseNotesType(index, appConfig.noteTypes.otherNoteType.id)} checked={notesTypesChecked[index] && notesTypesChecked[index][appConfig.noteTypes.otherNoteType.id] && notesTypesChecked[index][appConfig.noteTypes.otherNoteType.id].checked}></Form.Check>
          
          <div className="task-note-content">
              <textarea id="task-_note" className={'form-control'} value={notes[0]} onChange={(e) => modifyNote(index, e.target.value)} disabled={ notesTypeChecked[index] == undefined}></textarea>
          </div>
      </div>
    </Col>);
  }

  return (
    <TaskNotesContext.Provider value={{
      notesType, setNotesType, 
      notesTypesChecked, setNotesTypesChecked, 
      notesTypeChecked, setNotesTypeChecked, 
      notes, setNotes, 
      notesModified, setNotesModified,
      notesKey, setNotesKey,
      modifyNote,
      chooseNotesType,
      buildNote
    }}>
      {children}
    </TaskNotesContext.Provider>
  );
}

export default TaskNotesContextProvider;