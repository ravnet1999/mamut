import React, {createContext, useState } from 'react';

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
      setSelectedAppendices(null);
      setAppendicesUploading(false);
    });
  };

  // const onAppendixDownload = async (appendixId) => {
  //   setAppendicesDownloading([...appendicesDownloading, appendixId]);

  //   let appendixInfoUrl = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendixId}/json`;
  //   let result = await axios.get(`${appendixInfoUrl}`, {
  //     withCredentials: true
  //   });

  //   // setResponse(result.data);

  //   if(!result.data.error) {
  //     let appendix = result.data.resources;
  //     let buffer = new Uint8Array(appendix.data.data);
  //     let appendixDownloadUrl = window.URL.createObjectURL(new Blob([buffer], {"type": "application/octet-stream"}));
  //     let a = document.createElement('a');
  //     a.href = appendixDownloadUrl;
  //     a.download = appendix.nazwa_oryginalna;
  //     document.body.append(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(appendixDownloadUrl);
  //   }

  //   let appendicesDownloadingFiltered = [...appendicesDownloading];
  //   appendicesDownloadingFiltered = appendicesDownloadingFiltered.filter(appendicesDownloading => appendicesDownloading!==appendixId); 
  //   setAppendicesDownloading(appendicesDownloadingFiltered);
  // }

  const getCookie = cname => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const deleteCookie = cname => {
    document.cookie = cname +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  const getAppendixDownloadedCookieName = appendixId => {
    return `appendixDownloaded${appendixId}`;
  };

  const appendixDownloaded = appendixId => {  
    let appendixDownloadedCookieName = getAppendixDownloadedCookieName(appendixId);     
    let appendixDownloadedCookie = getCookie(appendixDownloadedCookieName);

    if(appendixDownloadedCookie === "true") {   
      let appendicesDownloadingFiltered = [...appendicesDownloading];
      appendicesDownloadingFiltered = appendicesDownloadingFiltered.filter(appendixDownloading => appendixDownloading!==appendixId); 
      setAppendicesDownloading(appendicesDownloadingFiltered);

      deleteCookie(appendixDownloadedCookieName);  

      return true;
    }

    return false;
  };

  const onAppendixDownload = (appendix) => {
    setAppendicesDownloading([...appendicesDownloading, appendix.id]);

    deleteCookie(getAppendixDownloadedCookieName(appendix.id));

    let appendixDownloadedInterval = setInterval(() => {
      if(appendixDownloaded(appendix.id)) clearInterval(appendixDownloadedInterval);
    }, 100); 

    let appendixDownloadUrl = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;

    let a = document.createElement('a');
    a.href = appendixDownloadUrl;
    a.download = appendix.nazwa_oryginalna;  
    document.body.append(a);
    a.click();
    a.remove();
  }

  const onAppendixRemove = async (appendix) => {
    setAppendicesRemoving([...appendicesRemoving, appendix.id]);

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    await sleep(5000);

    let appendicesRemovingFiltered = [...appendicesRemoving];
    appendicesRemovingFiltered = appendicesRemovingFiltered.filter(appendixRemoving => appendixRemoving!==appendix.id); 
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