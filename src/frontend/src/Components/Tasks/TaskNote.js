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
      setSelectedNoteTypes(noteToSelectedNoteTypes(note));
    }, [note]);

    const noteToSelectedNoteTypes = note => {
      return note.typy == "" ? [] : note.typy.split(",").map(function (typ) {        
        return { "id": parseInt(typ.split(";")[0]), "nazwa": typ.split(";")[1] };
      });
    }

    const noteTypeSelected = noteType => selectedNoteTypes.filter(selectedNoteType => {
      return selectedNoteType.id == noteType.id
    }).length > 0;

    const noteTypeCheckboxOnChange = noteType => {
      let newSelectedNoteTypes = selectedNoteTypes;

      if(noteTypeSelected(noteType)) {               
        newSelectedNoteTypes = newSelectedNoteTypes.filter(newSelectedNoteType => newSelectedNoteType.id !== noteType.id);
      } else {         
        newSelectedNoteTypes.push({ "id": noteType.id, "nazwa": noteType.nazwa });
      }

      selectedNote.typy = newSelectedNoteTypes.length == 0 ? "" : newSelectedNoteTypes.map(newSelectedNoteType => newSelectedNoteType.id + ";" + newSelectedNoteType.nazwa).join(",");
      setSelectedNoteTypes(newSelectedNoteTypes);

      updateNote(selectedNote);
    }
    
    const buildNoteTypes = () => {
      return noteTypes.map((noteType, key) => {
        return <Form.Check inline label={noteType.nazwa} checked={ noteTypeSelected(noteType) } type="checkbox" id="note-type" 
          onChange={ e => noteTypeCheckboxOnChange(noteType) }></Form.Check>
      })
    }

    return (
      selectedNote && <>
        { buildNoteTypes() }
        <textarea id="task-note" className={'form-control'} value={selectedNote.tresc} onChange={(e) => {
            selectedNote.tresc = e.target.value;
            updateNote(selectedNote);
          }
        }/>
      </>
    );
}

export default TaskNote;