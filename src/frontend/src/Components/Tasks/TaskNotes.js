import React, { useEffect, useState} from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNotesContext } from '../../Contexts/TaskNotesContext';
import TaskNoteHandler from '../../Handlers/TaskNoteHandler';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import Alert from '../Alert/Alert';
import TaskNotesList from './TaskNotesList';

const TaskNotes = (props) => {
    const { 
      task,
      response, setResponse,
      notes, setNotes,      
      notesDownloading, setNotesDownloading,
      noteTypesDownloading, setNoteTypesDownloading,
      noteTypes, setNoteTypes,
      updateNote, removeNote, addNote
    } = props;
    
    useEffect(() => {
      if(!task) return;
  
      setNotesDownloading(true); 

      TaskNoteHandler.getNotesByTaskId(task.id).then(result => {
        setNotes(result.resources);  
        setNotesDownloading(false); 
      });      
    }, [task]);

    useEffect(() => {
      setNoteTypesDownloading(true); 

      TaskNoteHandler.getNoteTypes().then(result => {
        console.log('note types', result.resources);
        setNoteTypes(result.resources); 
        setNoteTypesDownloading(false);  
      });      
    }, []);

    return (
      <>
      <Alert response={response}></Alert>
      <div className="form-group task-notes-container margin-bottom-default">
      <Row>
        <Col>
          <label for="task-notes"><strong>Notatki:</strong></label><br/>

          <div className="task-notes-content">
            <span className="clip-loader"><ClipLoader loading={notesDownloading || noteTypesDownloading} size={20} /></span>
            {
              notes.length>0 && noteTypes.length>0 && 
              <TaskNotesList notes={notes} noteTypes={noteTypes} updateNote={updateNote} removeNote={removeNote} addNote={addNote}></TaskNotesList>
            }
          </div>
        </Col>
      </Row>  
      </div> 
      </>
    );
}

export default WithContexts(TaskNotes, [TaskNotesContext]);