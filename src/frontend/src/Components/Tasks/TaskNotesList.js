import React, { useEffect, useState } from 'react';
import TaskNoteTypes from './TaskNoteTypes';
import TaskNote from './TaskNote';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';

const TaskNotesList = (props) => {
    const { 
      notes,
      noteTypes, 
      updateNote    
    } = props;

    const [notesList, setNotesList] = useState("");

    useEffect(() => {
      let newNotesList = notes.map((note, key) => {
        return <Card style={{width: "fit-content"}}>
          <Card.Body>
            <Card.Text>
              <TaskNoteTypes note={note} noteTypes={noteTypes}></TaskNoteTypes>
              <TaskNote note={note} updateNote={updateNote}></TaskNote>
            </Card.Text>
          </Card.Body>
        </Card>
      });

      setNotesList(newNotesList);
    }, [notes]);

    return <CardColumns style={{columnCount: "1"}}>
      { notesList }
    </CardColumns>
}

export default TaskNotesList;