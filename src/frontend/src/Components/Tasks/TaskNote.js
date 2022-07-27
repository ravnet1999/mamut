import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';

const TaskNote = (props) => {
    const { 
      note,
      noteTypes,      
      updateNote
    } = props;

    const [ selectedNote, setSelectedNote ] = useState(null);
    const [ selectedNoteTypes, setSelectedNoteTypes ] = useState([]);

    useEffect(() => {
      setSelectedNote(note);
      setSelectedNoteTypes(JSON.stringify(note.typy.split(",").map(typ => typ.split(";")[0])));
    }, [note]);

    const buildNoteTypes = () => {
      return noteTypes.map((noteType, key) => {
        return <Form.Check inline label={noteType.nazwa} checked={selectedNoteTypes.includes(noteType.id)} type="checkbox" id="note-type"></Form.Check>
      })
    }

    return (
      selectedNote && noteTypes && <>
        { buildNoteTypes() }
        <textarea id="task-note" className={'form-control'} value={selectedNote.tresc} onChange={(e) => {
            selectedNote.tresc=e.target.value;
            updateNote(selectedNote);
          }
        }/>
      </>
    );
}

export default TaskNote;