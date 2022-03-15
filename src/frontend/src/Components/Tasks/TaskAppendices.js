import React, { useEffect } from 'react';
import AppendixHandler from '../../Handlers/AppendixHandler';
import { Container, Row, Col, Button, Form } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskAppendicesContext } from '../../Contexts/TaskAppendicesContext';

const TaskAppendices = (props) => {
    const { 
      task,
      appendices, setAppendices,
      selectedAppendices, setSelectedAppendices, 
      taskAppendicesKey, setTaskAppendicesKey,
      onAppendicesChange,
      onAppendicesUpload,
      onAppendixDownload,
      buildAppendicesDownloadButtons,
      onAppendixRemove
    } = props;

    console.log("task",task);

    useEffect(() => {
      if(!task) return;
  
      AppendixHandler.getByTaskId(task.id).then(result => {
        setAppendices(result.resources);
      });
    }, [task])

    return (
      <div className="form-group task-appendices-container margin-bottom-default">
      <Row>
        <Col>
          <label for="task-appendices">Załączniki:</label><br/>
          <div className="task-appendices-content">
            <input id="task-appendices" name="task-appendices" key={taskAppendicesKey||''} multiple className={'form-control', 'margin-top-reduced',  'margin-bottom-default'} type="file" onChange={onAppendicesChange} />  
            <Button className="appendices-add-button" onClick={event => onAppendicesUpload(task.id)}><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></Button>
          </div>
          { appendices &&  buildAppendicesDownloadButtons()}
        </Col>
      </Row>  
      </div> 
    );
}

export default WithContexts(TaskAppendices, [TaskAppendicesContext]);