import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNoteContext } from '../../Contexts/TaskNoteContext';
import TaskNoteHandler from '../../Handlers/TaskNoteHandler';

const TaskNote = (props) => {
    const { 
      task,
      note,
      noteTypes,      
      updateNotePropagate, removeNotePropagate,
      selectedNote, setSelectedNote,
      selectedNoteTypes, setSelectedNoteTypes,
      noteToNoteTypes,
      noteTypeSelected,
      updateNoteWithNoteTypes,
      updateNoteType
    } = props;

    const generateIndex = () => Math.random().toString(36);

    useEffect(() => {
      let newNote = note;
      newNote.index = generateIndex();
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
      updateNoteType(noteType); 
      updateNotePropagate(selectedNote);
    }

    const updateNoteContent = (content) => {      
      selectedNote.tresc = content;

      let selectedNoteId = selectedNote.id

      if(content === "" && selectedNoteId !== 0) {
        let newSelectedNote = selectedNote;
        newSelectedNote.id = 0;
        newSelectedNote.index = generateIndex();
        TaskNoteHandler.remove(selectedNoteId).then(result => {
          setSelectedNote(newSelectedNote); 
          updateNotePropagate(selectedNote); 
        }).catch((err) => {
          console.log(err);
        });
      } else if(content !== "" && selectedNoteId===0) { 
        TaskNoteHandler.create(task.id, selectedNote).then(result => {          
          console.log(result);
          let newSelectedNote = result.resources;
          setSelectedNote(newSelectedNote); 
          updateNotePropagate(selectedNote);
        }).catch((err) => {
          console.log(err);
        });
      } else if(content !== "" && selectedNoteId!==0) { 
        TaskNoteHandler.update(selectedNoteId, selectedNote).then(result => {                    
          console.log(result);  
        }).catch((err) => {
          console.log(err);
        });
      }      
    }

    const noteContentTextareaValueOnChange = (e) => {
      updateNoteContent(e.target.value);
      updateNotePropagate(selectedNote);
    }

    const noteRemoveButtonOnClick = () => {      
      TaskNoteHandler.remove(selectedNote.id).then(result => {
        setSelectedNote(null);
        setSelectedNoteTypes([]);
        removeNotePropagate(note);
      }).catch((err) => {
        console.log(err);
      });      
    }

    return (
      selectedNote && <>
        { buildNoteTypes() }
        <textarea id="task-note-content" className={'form-control'} value={selectedNote.tresc} disabled={selectedNoteTypes.length == 0} onChange={noteContentTextareaValueOnChange}/>
        <Button data-tip="Usuń" className="note-remove-button" onClick={e=>noteRemoveButtonOnClick()}>
          <FontAwesomeIcon className="fa-sm" icon={faTrash}></FontAwesomeIcon>
        </Button>
        <ReactTooltip />
      </>
    );
}

export default WithContexts(TaskNote, [TaskNoteContext]);