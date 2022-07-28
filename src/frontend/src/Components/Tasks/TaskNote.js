import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';

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
      setSelectedNoteTypes(noteToNoteTypes(note));
    }, [note]);

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

    const noteTypeCheckboxOnChange = noteType => {
      let newSelectedNoteTypes = selectedNoteTypes;

      if(noteTypeSelected(noteType)) {               
        newSelectedNoteTypes = newSelectedNoteTypes.filter(newSelectedNoteType => newSelectedNoteType.id !== noteType.id);
      } else {         
        newSelectedNoteTypes.push({ "id": noteType.id, "nazwa": noteType.nazwa });
      }
           
      setSelectedNoteTypes(newSelectedNoteTypes);
      updateNoteWithNoteTypes(selectedNote, newSelectedNoteTypes); 
      updateNote(selectedNote);
    }
    
    const buildNoteTypes = () => {
      return noteTypes.map((noteType, key) => {
        return <Form.Check inline label={noteType.nazwa} checked={ noteTypeSelected(noteType) } type="checkbox" id="note-type" 
          onChange={ e => noteTypeCheckboxOnChange(noteType) }></Form.Check>
      })
    }
    
    const onNoteRemove = noteId => alert(noteId)

    return (
      selectedNote && <>
        { buildNoteTypes() }
        <textarea id="task-note" className={'form-control'} value={selectedNote.tresc} onChange={(e) => {
            selectedNote.tresc = e.target.value;
            updateNote(selectedNote);
          }
        }/>
        <Button data-tip="Usuń" className="note-remove-button" onClick={e=>onNoteRemove(selectedNote.id)}>
          <FontAwesomeIcon className="fa-sm" icon={faTrash}></FontAwesomeIcon>
        </Button>
        <ReactTooltip />
      </>
    );
}

export default TaskNote;