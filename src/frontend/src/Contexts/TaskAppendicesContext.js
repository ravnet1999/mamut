import React, {createContext, useState } from 'react';

import axios from 'axios';
import TaskHandler from '../Handlers/TaskHandler';
import appConfig from '../Config/appConfig.json';

export const TaskAppendicesContext = createContext();

const TaskAppendicesContextProvider = ({children}) => {
  const [appendices, setAppendices] = useState(null);
  const [selectedAppendices, setSelectedAppendices] = useState(null);
  const [appendicesKey, setAppendicesKey] = useState(null);
  const [appendicesUploading, setAppendicesUploading] = useState(false);  
  const [appendicesDownloading, setAppendicesDownloading] = useState([]);
  const [appendicesRemoving, setAppendicesRemoving] = useState([]);

  const onAppendicesChange = event => {
    setSelectedAppendices(event.target.files);       
  };

  const onAppendicesUpload = (taskId) => {
    if(!selectedAppendices) {
      // setResponse({"error": true, "messages": ["Wybierz załączniki do załadowania."]});
      return;
    }

    setAppendicesUploading(true);

    const formData = new FormData();

    for (let i = 0; i < selectedAppendices.length; i++) {
      formData.append(`task-appendices[${i}]`, selectedAppendices[i])
    }

    TaskHandler.addAppendices(taskId, formData).then((result) => {
      setAppendicesKey(Math.random().toString(36)); 
      setAppendices([...result.resources, ...appendices])
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setAppendicesUploading(false);
    });
  };

  const onAppendixDownload = async (appendixId) => {
    setAppendicesDownloading([...appendicesDownloading, appendixId]);

    let appendixInfoUrl = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendixId}/json`;
    let result = await axios.get(`${appendixInfoUrl}`, {
      withCredentials: true
    });

    // setResponse(result.data);

    if(!result.data.error) {
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

    let appendicesDownloadingFiltered = [...appendicesDownloading];
    appendicesDownloadingFiltered.filter(appendicesDownloading => appendicesDownloading!==appendixId); 
    setAppendicesDownloading(appendicesDownloadingFiltered);
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

  const onAppendixRemove = async (appendix) => {
    setAppendicesRemoving([...appendicesRemoving, appendix.id]);

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    await sleep(5000);

    let appendicesRemovingFiltered = [...appendicesRemoving];
    appendicesRemovingFiltered.filter(appendicesRemoving => appendicesRemoving!==appendix.id); 
    setAppendicesRemoving(appendicesRemovingFiltered);
  }

  return (
    <div>
      <TaskAppendicesContext.Provider value={{ appendices, setAppendices, selectedAppendices, setSelectedAppendices, appendicesKey, setAppendicesKey, onAppendicesChange, onAppendicesUpload, onAppendixDownload, onAppendixRemove, appendicesUploading, setAppendicesUploading, appendicesDownloading, setAppendicesDownloading, appendicesRemoving, setAppendicesRemoving }} >
        {children}
      </TaskAppendicesContext.Provider>
    </div>
  );
}

export default TaskAppendicesContextProvider;