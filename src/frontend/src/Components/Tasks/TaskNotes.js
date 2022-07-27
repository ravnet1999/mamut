import React, { useEffect} from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskNotesContext } from '../../Contexts/TaskNotesContext';
import TaskNoteHandler from '../../Handlers/TaskNoteHandler';
import { Container, Row, Col, Button, Form, Card, CardColumns } from '../bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import Alert from '../Alert/Alert';

const TaskNotes = (props) => {
    const { 
      task,
      response, setResponse,
      notes, setNotes,      
      notesUploading, setNotesUploading,
      noteTypes, setNoteTypes,
    } = props;
    
    useEffect(() => {
      if(!task) return;
  
      TaskNoteHandler.getNotesByTaskId(task.id).then(result => {
        console.log('notes', result.resources);
        setNotes(result.resources);  
      });      
    }, [task]);

    useEffect(() => {
      TaskNoteHandler.getNoteTypes().then(result => {
        console.log('note types', result.resources);
        setNoteTypes(result.resources);  
      });      
    }, []);

    return (
      <>
      <Alert response={response}></Alert>
      <div className="form-group task-notes-container margin-bottom-default">
      <Row>
        <Col>
          <label for="task-notes"><strong>Notatki:</strong></label><br/>

          <div className="task-notes-content">
            <span className="clip-loader"><ClipLoader loading={notesUploading} size={20} /></span>        
            { notes.length > 0 && <CardColumns style={{columnCount: "1"}}>
              { notes.map((note, key) => {
                return <Card style={{width: "fit-content"}}>
                  <Card.Body>
                    <Card.Text>
                      <textarea id="task-note" className={'form-control'} value={note.tresc}></textarea>
                    </Card.Text>
                  </Card.Body>
                </Card>
                })
              }
              </CardColumns> 
            }
          </div>
        </Col>
      </Row>  
      </div> 
      </>
    );
}

export default WithContexts(TaskNotes, [TaskNotesContext]);