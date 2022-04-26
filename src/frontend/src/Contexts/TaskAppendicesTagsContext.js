import React, {createContext, useState } from 'react';

export const TaskAppendicesTagsContext = createContext();

const TaskAppendicesTagsContextProvider = ({children}) => { 
  const [tagToCreate, setTagToCreate] = useState(null);
  const [tagsToCreate, setTagsToCreate] = useState([]);
  const [tagToCreateKey, setTagToCreateKey] = useState(null);
  const [tagToCreateFocus, setTagToCreateFocus] = useState(false);  
  const [tagsConfirmed, setTagsConfirmed] = useState([]);

  const onTagToCreateChange = tagName => {
    setTagToCreate(tagName);
  }

  const afterTagToCreateConfirmed = () => {
    setTagToCreate(null);
    setTagToCreateKey(Math.random().toString(36));
    setTagToCreateFocus(true);
  }
  
  const onTagConfirmedRemove = tagName => {
    setTagsConfirmed(tagsConfirmed.filter(name => name != tagName));
  }
  
  return (
    <div>
      <TaskAppendicesTagsContext.Provider value={{ 
        tagToCreate, setTagToCreate, 
        tagsToCreate, setTagsToCreate, 
        tagToCreateKey, setTagToCreateKey,
        tagToCreateFocus, setTagToCreateFocus, 
        tagsConfirmed, setTagsConfirmed,
        onTagToCreateChange, 
        afterTagToCreateConfirmed,
        onTagConfirmedRemove         
      }}>
        {children}
      </TaskAppendicesTagsContext.Provider>
    </div>
  );
}

export default TaskAppendicesTagsContextProvider;