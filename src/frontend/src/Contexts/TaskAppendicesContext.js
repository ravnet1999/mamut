import React, {createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import TaskHandler from '../Handlers/TaskHandler';
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
  
  const [tag, setTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagKey, setTagKey] = useState(null);

  const [tagToCreate, setTagToCreate] = useState(null);
  const [tagsToCreate, setTagsToCreate] = useState([]);
  const [tagToCreateKey, setTagToCreateKey] = useState(null);
  
  const [tagsConfirmed, setTagsConfirmed] = useState([]);

  const [tagsFocus, setTagsFocus] = useState([]);
  const [tagToCreateFocus, setTagToCreateFocus] = useState(false);  

  const onAppendicesChange = event => {
    setSelectedAppendices(event.target.files);       
  };

  const onAppendicesUpload = (taskId) => {
    setAppendicesUploading(true);

    const formData = new FormData();

    for (let i = 0; i < selectedAppendices.length; i++) {
      formData.append(`task-appendices[${i}]`, selectedAppendices[i]);
      formData.append(`tags`, tagsConfirmed);
    }

    TaskHandler.addAppendices(taskId, formData, tagsConfirmed).then((result) => {
      setAppendicesKey(Math.random().toString(36)); 
      setAppendices([...result.resources, ...appendices]);
      setResponse(result);
    }).catch((err) => {
      console.log(err);
      setResponse(err);
    }).finally(() => {
      setSelectedAppendices(null);
      setAppendicesUploading(false);
      setTagsConfirmed([]);
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

  const onTagRemove = async (appendix, tagId) => { 
    if(Object.entries(appendix.tagi).length == 1) {
      setResponse({
        error: true,
        messages: ['Nie można usunąć jedynego tagu do załącznika.']
      }); 
      return;
    }
    
    let appendixId = appendix.id;

    AppendixHandler.deleteTag(appendixId, tagId).then((result) => {  
      let appendicesUpdated = appendices.map(appendix => {
        if(appendix.id == appendixId) {
          delete appendix.tagi[tagId];
        }
        return appendix;
      });
      setAppendicesKey(Math.random().toString(36));   
      setAppendices([...appendicesUpdated]);      
      
      setResponse({
        error: false,
        messages: ['Pomyślnie usunięto tag do załącznika.']
      });                  
    }).catch((err) => {
      console.log(err);
      setResponse(err);
    }); 
  }

  const onTagChange = (appendix, tagName) => {
    let appendixId = appendix.id;

    let tagsUpdated = tags.filter(tag => tag.appendixId != appendixId);
    tagsUpdated.push({appendixId, name:tagName});
    setTags([...tagsUpdated]);
  }

  const afterTagCreated = (appendixId) => {
    let tagsFocusUpdated = [];
    tagsFocusUpdated[appendixId] = true;
    setTagsFocus(tagsFocusUpdated);

    setTag(null);
    setTagKey(Math.random().toString(36)); 

    let tagsUpdated = tags.filter(tag => tag.appendixId != appendixId);
    setTags([...tagsUpdated]);
  }

  const onTagCreate = async (appendix) => {    
    let appendixId = appendix.id;
    let tagsFiltered = tags.filter(tag => tag.appendixId == appendixId);

    if(!tagsFiltered.length || tagsFiltered[0].name.length < 3) {
      setResponse({
        error: true,
        messages: ['Tag musi mieć co najmniej 3 znaki.']
      }); 
      return;   
    } 

    let tagName = tagsFiltered[0].name;

    if(Object.values(appendix.tagi).includes(tagName)) {
      setResponse({
        error: true,
        messages: [`Tag "${tagName}" już istnieje.`]
      }); 
      afterTagCreated(appendixId);
      return;   
    }

    try {
      let results = await AppendixHandler.addTags(appendixId, tagName);
      
      let appendicesUpdated = appendices.map(appendix => {
        if(appendix.id == appendixId) {  
          appendix.tagi[results.resources[0].id] = tagName;
        }
        return appendix;
      });
  
      setAppendices([...appendicesUpdated]);   
      
      setResponse({
        error: false,
        messages: ['Pomyślnie dodano tag do załącznika.']
      });  
    } catch(err) {
      console.log(err);
      setResponse(err);
    } finally {
      afterTagCreated(appendixId);
    }
  }

  const onTagToCreateChange = tagName => {
    setTagToCreate(tagName);
  }

  const afterTagToCreateConfirmed = () => {
    setTagToCreate(null);
    setTagToCreateKey(Math.random().toString(36));
    setTagToCreateFocus(true);
  }
  
  const onTagToCreateConfirm = (event) => {   
    if(!tagToCreate || tagToCreate.length < 3) {
      setResponse({
        error: true,
        messages: ['Tag musi mieć co najmniej 3 znaki.']
      });  
    } else {
        if(!tagsConfirmed.includes(tagToCreate)) { 
        setTagsConfirmed([...tagsConfirmed, tagToCreate]);

        setResponse({
          error: true,
          messages: ['Pomyślnie dodano tag do załącznika.']
        });       
      } else {
        setResponse({
          error: true,
          messages: [`Tag "${tagToCreate}" już istnieje.`]
        }); 
      }
      afterTagToCreateConfirmed();
    }
  }

  const onTagConfirmedRemove = tagName => {
    setTagsConfirmed(tagsConfirmed.filter(name => name != tagName));
  }

  return (
    <div>
      <TaskAppendicesContext.Provider value={{ appendices, setAppendices, selectedAppendices, setSelectedAppendices, appendicesKey, setAppendicesKey, onAppendicesChange, onAppendicesUpload, onAppendixDownload, onAppendixRemove, appendicesUploading, setAppendicesUploading, appendicesDownloading, setAppendicesDownloading, appendicesRemoving, setAppendicesRemoving, appendixRemoveModal, setAppendixRemoveModal, appendixRemoveModalVisible, setAppendixRemoveModalVisible, response, setResponse, onTagRemove, onTagChange, onTagCreate, tags, setTags, tagsToCreate, setTagsToCreate, tagsConfirmed, setTagsConfirmed, onTagToCreateChange, onTagToCreateConfirm, onTagConfirmedRemove, tagToCreate, setTagToCreate, tagToCreateKey, setTagToCreateKey, tag, setTag, tagKey, setTagKey, tagsFocus, setTagsFocus, tagToCreateFocus, setTagToCreateFocus }} >
        {children}
      </TaskAppendicesContext.Provider>
    </div>
  );
}

export default TaskAppendicesContextProvider;