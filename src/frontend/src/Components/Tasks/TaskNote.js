import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNoteContext } from '../../Contexts/TaskNoteContext';

const TaskNote = (props) => {
    const { 
      note,
      noteTypes,      
      updateNote, removeNote,
      selectedNote, setSelectedNote,
      selectedNoteTypes, setSelectedNoteTypes,
      noteToNoteTypes,
      noteTypeSelected,
      updateNoteWithNoteTypes
    } = props;

    useEffect(() => {
      let newNote = note;
      newNote.index = Math.random().toString(36);
      setSelectedNote(newNote);
      setSelectedNoteTypes(noteToNoteTypes(newNote));
    }, [note]);

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

    const onNoteRemove = noteIndex => {      
      setSelectedNote(null);
      setSelectedNoteTypes([]);
      removeNote(noteIndex);
    }

    return (
      selectedNote && <>
        { buildNoteTypes() }
        <textarea id="task-note" className={'form-control'} value={selectedNote.tresc} onChange={(e) => {
            selectedNote.tresc = e.target.value;
            updateNote(selectedNote);
          }
        }/>
        <Button data-tip="Usuń" className="note-remove-button" onClick={e=>onNoteRemove(selectedNote.index)}>
          <FontAwesomeIcon className="fa-sm" icon={faTrash}></FontAwesomeIcon>
        </Button>
        <ReactTooltip />
      </>
    );
}

export default WithContexts(TaskNote, [TaskNoteContext]);