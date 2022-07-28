import React, { useEffect, useState } from 'react';
import TaskNote from './TaskNote';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';

const TaskNotesList = (props) => {
    const { 
      notes,
      noteTypes, 
      updateNote, removeNote, addNote
    } = props;

    const [notesList, setNotesList] = useState("");
    const [selectedNotes, setSelectedNotes] = useState([]);

    const onNoteAdd = () => {
      addNote()
      alert("list")
      alert(JSON.stringify(selectedNotes))  
    }

    useEffect(() => {
      setSelectedNotes(notes);
    }, [notes]);

    useEffect(() => {
      let newNotesList = selectedNotes.map((note, key) => {
        return <Card style={{width: "fit-content"}}>
          <Card.Body>
            <Card.Text>
              <TaskNote note={note} noteTypes={noteTypes} updateNote={updateNote} removeNote={removeNote}></TaskNote>
            </Card.Text>
          </Card.Body>
        </Card>
      });

      setNotesList(newNotesList);
    }, [selectedNotes]);

    return <CardColumns style={{columnCount: "1"}}>
      { notesList }
      <Button data-tip="Dodaj" className="note-add-button" onClick={e=>onNoteAdd()}>
        <FontAwesomeIcon className="fa-sm" icon={faPlus}></FontAwesomeIcon>
      </Button>
      <ReactTooltip />
    </CardColumns>
}

export default TaskNotesList;