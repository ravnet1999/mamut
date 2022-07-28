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
      updateNotePropagate, removeNotePropagate,
      selectedNote, setSelectedNote,
      selectedNoteTypes, setSelectedNoteTypes,
      noteToNoteTypes,
      noteTypeSelected,
      updateNoteWithNoteTypes,
      removeNote, updateNote
    } = props;

    useEffect(() => {
      let newNote = note;
      newNote.index = Math.random().toString(36);
      setSelectedNote(newNote);
      setSelectedNoteTypes(noteToNoteTypes(newNote));
    }, [note]);

    const buildNoteTypes = () => {
      return noteTypes.map((noteType, key) => {
        return <Form.Check inline label={noteType.nazwa} checked={ noteTypeSelected(noteType) } type="checkbox" id="note-type" 
          onChange={ e => noteTypeCheckboxOnChange(noteType) }></Form.Check>
      })
    }

    const noteTypeCheckboxOnChange = noteType => {
      updateNote(noteType); 
      updateNotePropagate(selectedNote);
    }

    const noteContentTextareaValueOnChange = (e) => {
      selectedNote.tresc = e.target.value;
      updateNotePropagate(selectedNote);
    }

    const noteRemoveButtonOnClick = noteIndex => {      
      removeNote();
      removeNotePropagate(noteIndex);
    }

    return (
      selectedNote && <>
        { buildNoteTypes() }
        <textarea id="task-note-content" className={'form-control'} value={selectedNote.tresc} disabled={selectedNoteTypes.length == 0} onChange={noteContentTextareaValueOnChange}/>
        <Button data-tip="Usuń" className="note-remove-button" onClick={e=>noteRemoveButtonOnClick(selectedNote.index)}>
          <FontAwesomeIcon className="fa-sm" icon={faTrash}></FontAwesomeIcon>
        </Button>
        <ReactTooltip />
      </>
    );
}

export default WithContexts(TaskNote, [TaskNoteContext]);