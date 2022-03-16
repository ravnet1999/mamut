import React, { useEffect } from 'react';
import AppendixHandler from '../../Handlers/AppendixHandler';
import { Container, Row, Col, Button, Form } from '../bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WithContexts } from '../../HOCs/WithContexts';
import { TaskAppendicesContext } from '../../Contexts/TaskAppendicesContext';
import ClipLoader from "react-spinners/ClipLoader";

const TaskAppendices = (props) => {
    const { 
      task,
      appendices, setAppendices,
      selectedAppendices, setSelectedAppendices, 
      taskAppendicesKey, setTaskAppendicesKey,
      appendicesUploading, setAppendicesUploading,
      onAppendicesChange,
      onAppendicesUpload,
      onAppendixDownload,
      onAppendixRemove
    } = props;

    useEffect(() => {
      if(!task) return;
  
      AppendixHandler.getByTaskId(task.id).then(result => {
        setAppendices(result.resources);
      });
    }, [task]);

    return (
      <div className="form-group task-appendices-container margin-bottom-default">
      <Row>
        <Col>
          <label for="task-appendices">Załączniki:</label><br/>
          <div className="task-appendices-content">
            <input id="task-appendices" name="task-appendices" key={taskAppendicesKey||''} multiple className={'form-control', 'margin-top-reduced',  'margin-bottom-default'} type="file" onChange={onAppendicesChange} />  
            {!appendicesUploading && <Button className="appendices-add-button" onClick={e=>onAppendicesUpload(task.id)}><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></Button>}
            <ClipLoader loading={appendicesUploading} size={20} />
          </div>
          { appendices &&  appendices.map((appendix, key) => {
          // let url = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;
          // return <a href={url} target="_blank" download={appendix.nazwa_oryginalna}>{appendix.nazwa_oryginalna}</a>;
            return <Row className="margin-top-default">
              <Col>
                {appendix.nazwa_oryginalna}
                <Button className="appendix-download-button" onClick={e=>onAppendixDownload(appendix.id)}>
                  <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
                </Button>
                <Button className="appendix-remove-button" onClick={e=>onAppendixRemove(appendix)}>
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                </Button>
              </Col>
            </Row>})
          }
        </Col>
      </Row>  
      </div> 
    );
}

export default WithContexts(TaskAppendices, [TaskAppendicesContext]);