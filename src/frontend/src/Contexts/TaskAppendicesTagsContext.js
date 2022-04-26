import React, {createContext, useState } from 'react';

export const TaskAppendicesTagsContext = createContext();

const TaskAppendicesTagsContextProvider = ({children}) => { 
  const [tagToCreate, setTagToCreate] = useState(null);
  const [tagsToCreate, setTagsToCreate] = useState([]);
  const [tagToCreateKey, setTagToCreateKey] = useState(null);
  const [tagToCreateFocus, setTagToCreateFocus] = useState(false);  
  const [tagsConfirmed, setTagsConfirmed] = useState([]);

  const [tag, setTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagKey, setTagKey] = useState(null);
  const [tagsFocus, setTagsFocus] = useState([]);

  const onTagToCreateChange = tagName => {
    setTagToCreate(tagName);
  }

  const afterTagToCreateConfirmed = () => {
    setTagToCreate(null);
    setTagToCreateKey(Math.random().toString(36));
    setTagToCreateFocus(true);
  }

  const onTagToCreateConfirm = (event, setResponse) => {   
    if(!tagToCreate || tagToCreate.length < 3) {
      setResponse({
        error: true,
        messages: ['Tag musi mieć co najmniej 3 znaki.']
      });  
    } else {
        if(!tagsConfirmed.includes(tagToCreate)) { 
        setTagsConfirmed([...tagsConfirmed, tagToCreate]);

        setResponse({
          error: false,
          messages: ['Pomyślnie dodano tag.']
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

  const afterTagCreated = (appendixId) => {
    let tagsFocusUpdated = [];
    tagsFocusUpdated[appendixId] = true;
    setTagsFocus(tagsFocusUpdated);

    setTag(null);
    setTagKey(Math.random().toString(36)); 

    let tagsUpdated = tags.filter(tag => tag.appendixId != appendixId);
    setTags([...tagsUpdated]);
  }

  const onTagCreate = async (appendix, updateAppendicesOnTagCreate, setResponse) => {    
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
      updateAppendicesOnTagCreate(appendixId, tagName);
      return;   
    }

    try {
      updateAppendicesOnTagCreate(appendixId, tagName);  
      
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

  const onTagChange = (appendix, tagName, setResponse) => {
    let appendixId = appendix.id;

    let tagsUpdated = tags.filter(tag => tag.appendixId != appendixId);
    tagsUpdated.push({appendixId, name:tagName});
    setTags([...tagsUpdated]);
  }

  const onTagRemove = async (appendix, tagId, updateAppendicesOnTagRemove, setResponse) => {    
    if(Object.entries(appendix.tagi).length == 1) { 
      setResponse({
        error: true,
        messages: ['Nie można usunąć jedynego tagu do załącznika.']
      }); 
      return;
    }
    
    let appendixId = appendix.id;

    try {
      updateAppendicesOnTagRemove(appendixId, tagId);        
      
      setResponse({
        error: false,
        messages: ['Pomyślnie usunięto tag do załącznika.']
      });                  
    } catch(err) {
      console.log(err);
      setResponse(err);
    }; 
  }
  
  return (
    <div>
      <TaskAppendicesTagsContext.Provider value={{ 
        tagToCreate, setTagToCreate, 
        tagsToCreate, setTagsToCreate, 
        tagToCreateKey, setTagToCreateKey,
        tagToCreateFocus, setTagToCreateFocus, 
        tagsConfirmed, setTagsConfirmed,

        tag, setTag,
        tags, setTags,
        tagKey, setTagKey,
        tagsFocus, setTagsFocus,

        onTagToCreateChange, 
        afterTagToCreateConfirmed,
        onTagToCreateConfirm,
        onTagConfirmedRemove,
        
        onTagCreate,
        onTagChange,
        onTagRemove
      }}>
        {children}
      </TaskAppendicesTagsContext.Provider>
    </div>
  );
}

export default TaskAppendicesTagsContextProvider;