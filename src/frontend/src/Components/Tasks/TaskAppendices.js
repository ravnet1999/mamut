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
      appendicesKey, setAppendicesKey,
      appendicesUploading, setAppendicesUploading,
      appendicesDownloading, setAppendicesDownloading,
      appendicesRemoving, setAppendicesRemoving,
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
            <input id="task-appendices" name="task-appendices" key={appendicesKey||''} multiple className={'form-control', 'margin-top-reduced',  'margin-bottom-default'} type="file" onChange={onAppendicesChange} />  
            {!appendicesUploading && 
              <Button disabled={!selectedAppendices || appendicesDownloading.length>0 || appendicesRemoving.length>0} className="appendices-add-button" onClick={e=>onAppendicesUpload(task.id)}>
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
              </Button>
            }
            <ClipLoader loading={appendicesUploading} size={20} />
          </div>
          { appendices &&  appendices.map((appendix, key) => {
          // let url = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;
          // return <a href={url} target="_blank" download={appendix.nazwa_oryginalna}>{appendix.nazwa_oryginalna}</a>;
            return <Row className="margin-top-default" key={appendix.id}>
              <Col>
                {appendix.nazwa_oryginalna}
                
                {!appendicesDownloading.includes(appendix.id) && 
                  <Button disabled={appendicesUploading || appendicesDownloading.length>0 || appendicesRemoving.length>0} className="appendix-download-button" onClick={e=>onAppendixDownload(appendix)}>
                    <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
                  </Button>
                }
                <ClipLoader loading={appendicesDownloading.includes(appendix.id)} size={20} />

                {!appendicesRemoving.includes(appendix.id) &&
                  <Button disabled={appendicesUploading || appendicesDownloading.length>0 || appendicesRemoving.length>0} className="appendix-remove-button" onClick={e=>onAppendixRemove(appendix)}>
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </Button>
                }
                <ClipLoader loading={appendicesRemoving.includes(appendix.id)} size={20} />
              </Col>
            </Row>})
          }
        </Col>
      </Row>  
      </div> 
    );
}

export default WithContexts(TaskAppendices, [TaskAppendicesContext]);