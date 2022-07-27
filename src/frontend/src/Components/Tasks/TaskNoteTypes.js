import React from 'react';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';

const TaskNoteTypes = (props) => {
    const { 
      note,      
      noteTypes
    } = props;

    return (
      <>
        { noteTypes.map((noteType, key) => {
          return <Form.Check inline label={noteType.nazwa} type="checkbox" id="note-type"></Form.Check>
          })
        }
      </>
    );
}

export default TaskNoteTypes;