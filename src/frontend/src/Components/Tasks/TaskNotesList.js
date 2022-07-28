import React, { useEffect, useState } from 'react';
import TaskNote from './TaskNote';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';

const TaskNotesList = (props) => {
    const { 
      notes,
      noteTypes, 
      updateNote, removeNote    
    } = props;

    const [notesList, setNotesList] = useState("");

    useEffect(() => {
      let newNotesList = notes.map((note, key) => {
        return <Card style={{width: "fit-content"}}>
          <Card.Body>
            <Card.Text>
              <TaskNote note={note} noteTypes={noteTypes} updateNote={updateNote} removeNote={removeNote}></TaskNote>
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