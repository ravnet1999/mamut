import React, { useEffect, useState } from 'react';
import TaskNote from './TaskNote';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';
import TaskNoteContextProvider from '../../Contexts/TaskNoteContext';

const TaskNotesList = (props) => {
    const { 
      notes,
      noteTypes, 
      updateNotePropagate, removeNotePropagate, addNote
    } = props;

    const [selectedNotes, setSelectedNotes] = useState([]);
    const [noteListKey, setNoteListKey] = useState(0)

    const onNoteAdd = () => {
      addNote();  
      setNoteListKey(Math.random().toString(36));
    }

    useEffect(() => {
      setSelectedNotes(notes);
    }, [notes]);

    const buildNoteList = () => {
      return selectedNotes.map((note, key) => {
        return <Card style={{width: "fit-content"}}>
          <Card.Body>
            <Card.Text>
              <TaskNoteContextProvider><TaskNote note={note} noteTypes={noteTypes} updateNotePropagate={updateNotePropagate} removeNotePropagate={removeNotePropagate}></TaskNote></TaskNoteContextProvider>
            </Card.Text>
          </Card.Body>
        </Card>
      });
    }

    return <CardColumns key={noteListKey} style={{columnCount: "1"}}>
      { selectedNotes.length>0 && noteTypes.length>0 && buildNoteList() }
      <Button data-tip="Dodaj" className="note-add-button" onClick={e=>onNoteAdd()}>
        <FontAwesomeIcon className="fa-sm" icon={faPlus}></FontAwesomeIcon>
      </Button>
      <ReactTooltip />
    </CardColumns>
}

export default TaskNotesList;