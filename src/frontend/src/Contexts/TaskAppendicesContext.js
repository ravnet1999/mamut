import React, {createContext, useState } from 'react';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import TaskHandler from '../Handlers/TaskHandler';
import appConfig from '../Config/appConfig.json';
import { Row, Col, Button } from '../Components/bootstrap';

export const TaskAppendicesContext = createContext();

const TaskAppendicesContextProvider = ({children}) => {
  const [appendices, setAppendices] = useState(null);
  const [selectedAppendices, setSelectedAppendices] = useState(null);
  const [taskAppendicesKey, setTaskAppendicesKey] = useState(null);

  const onAppendicesChange = event => {
    setSelectedAppendices(event.target.files);       
  };

  const onAppendicesUpload = (taskId) =>  {
    if(!selectedAppendices) {
      // setResponse({"error": true, "messages": ["Wybierz załączniki do załadowania."]});
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < selectedAppendices.length; i++) {
      formData.append(`task-appendices[${i}]`, selectedAppendices[i])
    }

    TaskHandler.addAppendices(taskId, formData).then((result) => {
      setTaskAppendicesKey(Math.random().toString(36)); 
      setAppendices([...result.resources, ...appendices])
    }).catch((err) => {
      console.log(err);
    });
  };

  const onAppendixDownload = async (appendixId) => {
    let appendixInfoUrl = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendixId}/json`;
    let result = await axios.get(`${appendixInfoUrl}`, {
      withCredentials: true
    });

    // setResponse(result.data);

    if(result.data.error) return;

    let appendix = result.data.resources;
    let buffer = new Uint8Array(appendix.data.data);
    let appendixDownloadUrl = window.URL.createObjectURL(new Blob([buffer], {"type": "application/octet-stream"}));
    let a = document.createElement('a');
    a.href = appendixDownloadUrl;
    a.download = appendix.nazwa_oryginalna;
    document.body.append(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(appendixDownloadUrl);
  }

  // const onAppendixDownload = async (appendix) => {
  //   let appendixDownloadUrl = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;

  //   let a = document.createElement('a');
  //   a.href = appendixDownloadUrl;
  //   a.download = appendix.nazwa_oryginalna;  
  //   document.body.append(a);
  //   a.click();
  //   a.remove();
  //   window.URL.revokeObjectURL(appendixDownloadUrl);
  // }

  const buildAppendicesDownloadButtons = () => {
    return appendices.map((appendix, key) => {
      // let url = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;
      // return <a href={url} target="_blank" download={appendix.nazwa_oryginalna}>{appendix.nazwa_oryginalna}</a>;
      return <Row className="margin-top-default">
          <Col>
            {appendix.nazwa_oryginalna}
            <Button className="appendix-download-button" onClick={e=>{onAppendixDownload(appendix.id)}}>
              <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
            </Button>
            <Button className="appendix-remove-button" onClick={e=>{onAppendixRemove(appendix)}}>
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </Button>
          </Col>
        </Row>
    });    
  } 

  const onAppendixRemove = () => {

  }

  return (
    <div>
      <TaskAppendicesContext.Provider value={{ appendices, setAppendices, selectedAppendices, setSelectedAppendices, taskAppendicesKey, setTaskAppendicesKey, onAppendicesChange, onAppendicesUpload, onAppendixDownload, buildAppendicesDownloadButtons, onAppendixRemove }} >
        {children}
      </TaskAppendicesContext.Provider>
    </div>
  );
}

export default TaskAppendicesContextProvider;