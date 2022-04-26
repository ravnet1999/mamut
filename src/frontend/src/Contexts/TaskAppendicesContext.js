import React, {createContext, useState } from 'react';
import AppendixHandler from '../Handlers/AppendixHandler';
import appConfig from '../Config/appConfig.json';

export const TaskAppendicesContext = createContext();

const TaskAppendicesContextProvider = ({children}) => {
  const [response, setResponse] = useState(null);
  const [appendices, setAppendices] = useState([]);
  const [selectedAppendices, setSelectedAppendices] = useState(null);
  const [appendicesKey, setAppendicesKey] = useState(null);
  const [appendicesUploading, setAppendicesUploading] = useState(false);  
  const [appendicesDownloading, setAppendicesDownloading] = useState([]);
  const [appendicesRemoving, setAppendicesRemoving] = useState([]);
  const [appendixRemoveModal, setAppendixRemoveModal] = useState({
    title: '',
    description: '',
    buttons: []
  });
  const [appendixRemoveModalVisible, setAppendixRemoveModalVisible] = useState(false);
  
  const onAppendicesChange = event => {
    setSelectedAppendices(event.target.files);       
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

  const markAppendixAsDownloaded = (appendixId, appendixDownloadedCookieName) => {
    let appendicesDownloadingFiltered = [...appendicesDownloading];
    appendicesDownloadingFiltered = appendicesDownloadingFiltered.filter(appendixDownloading => appendixDownloading!==appendixId); 
    setAppendicesDownloading(appendicesDownloadingFiltered);

    deleteCookie(appendixDownloadedCookieName);
  }

  const appendixDownloaded = appendixId => {  
    let appendixDownloadedCookieName = getAppendixDownloadedCookieName(appendixId);     
    let appendixDownloadedCookie = getCookie(appendixDownloadedCookieName);

    if (["true", "false"].includes(appendixDownloadedCookie)) {
      markAppendixAsDownloaded(appendixId, appendixDownloadedCookieName);

      if(appendixDownloadedCookie === "true") {  
        setResponse({
          error: false,
          messages: ['Pomyślnie pobrano załącznik.']
        });
  
        return true;
      } else {
        setResponse({
          error: true,
          messages: ['Nie udało się pobrać załącznika.']
        });
      }
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
    setAppendixRemoveModal({
      title: `Czy na pewno chcesz usunąć załącznik ${appendix.nazwa_oryginalna}?`,
      description: '',
      buttons: [
          {
              name: 'Potwierdź',
              method: () => {
                let appendixId = appendix.id;
                setAppendicesRemoving([...appendicesRemoving, appendixId]);
            
                AppendixHandler.delete(appendixId).then((result) => {
                  let appendicesFiltered = [...appendices];
                  appendicesFiltered = appendicesFiltered.filter(appendix => {                    
                    return appendix.id!=appendixId
                  });
                  console.log(appendicesFiltered);
                  setAppendicesKey(Math.random().toString(36));   
                  setAppendices(appendicesFiltered);
                  
                  setResponse({
                    error: false,
                    messages: ['Pomyślnie usunięto załącznik.']
                  });                  
                }).catch((err) => {
                  console.log(err);
                  setResponse(err);
                }).finally(() => {
                  let appendicesRemovingFiltered = [...appendicesRemoving];
                  appendicesRemovingFiltered = appendicesRemovingFiltered.filter(appendixRemoving => appendixRemoving!==appendix.id); 
                  setAppendicesRemoving(appendicesRemovingFiltered);
                });
                  setAppendixRemoveModalVisible(false);
              },
          }
      ]
    }); 
    setAppendixRemoveModalVisible(true);
  }

  return (
    <div>
      <TaskAppendicesContext.Provider value={{ response, setResponse, appendices, setAppendices, selectedAppendices, setSelectedAppendices, appendicesKey, setAppendicesKey, onAppendicesChange, onAppendixDownload, onAppendixRemove, appendicesUploading, setAppendicesUploading, appendicesDownloading, setAppendicesDownloading, appendicesRemoving, setAppendicesRemoving, appendixRemoveModal, setAppendixRemoveModal, appendixRemoveModalVisible, setAppendixRemoveModalVisible }} >
        {children}
      </TaskAppendicesContext.Provider>
    </div>
  );
}

export default TaskAppendicesContextProvider;