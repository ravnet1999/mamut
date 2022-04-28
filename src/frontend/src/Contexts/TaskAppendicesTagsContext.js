import React, {createContext, useState } from 'react';
import TagHandler from '../Handlers/TagHandler';
import AppendixHandler from '../Handlers/AppendixHandler';

export const TaskAppendicesTagsContext = createContext();

const TaskAppendicesTagsContextProvider = ({children}) => { 
  const tagsSelectPlaceholder = <div>Wyszukaj tagi lub dodaj nowe</div>;
  const tagsSelectFormatCreateLabel = userInput => `Utwórz nowy tag: ${userInput}`;
  const [tagsSelectDefaultOptions, setTagsSelectDefaultOptions] = useState([]);

  const [newAppendicesTags, setNewAppendicesTags] = useState([]);
  const [savedAppendicesTags, setSavedAppendicesTags] = useState([]);

  const tagsSelectPromiseOptions = inputValue => TagHandler.search(1, inputValue);

  const newAppendicesTagsSelectHandleChange = (selectedOptions) => {
    setNewAppendicesTags(selectedOptions);
  };
  
  const savedAppendicesTagsSelectHandleChange = (appendix, appendices, setAppendices) => async (selectedOptions) => {
    let appendixId = appendix.id;

    let tagsAdded = !savedAppendicesTags[appendixId] ? selectedOptions : selectedOptions.filter(newTag => !savedAppendicesTags[appendixId].includes(newTag));
    let tagsDeleted = !savedAppendicesTags[appendixId] ? [] : savedAppendicesTags[appendixId].filter(savedTag => !selectedOptions.includes(savedTag));

    if(tagsAdded.length) {
      let tagAddedName = tagsAdded[0].label;
      let results = await AppendixHandler.addTags(appendixId, tagAddedName);
      
      let appendicesUpdated = appendices.map(appendix => {
        if(appendix.id == appendixId) {  
          if(!appendix.tagi) appendix.tagi = [];
          appendix.tagi[results.resources[0].id] = tagAddedName;
        }
        return appendix;
      });
  
      setAppendices([...appendicesUpdated]); 
    } else if(tagsDeleted.length) {
      let tagDeletedName = tagsDeleted[0].label;
      let tagId = Object.entries(appendix.tagi).filter(tag => tag[1] ==tagDeletedName)[0][0];

      await AppendixHandler.deleteTag(appendixId, tagId);

      let appendicesUpdated = appendices.map(appendix => {
        if(appendix.id == appendixId) {                    
          delete appendix.tagi[tagId];
        }
        return appendix;
      });
      
      setAppendices([...appendicesUpdated]);
    } 
  };
  
  return (
    <div>
      <TaskAppendicesTagsContext.Provider value={{ 
        tagsSelectPlaceholder,
        tagsSelectFormatCreateLabel,
        tagsSelectPromiseOptions,  
        tagsSelectDefaultOptions, setTagsSelectDefaultOptions,

        newAppendicesTags, setNewAppendicesTags,
        savedAppendicesTags, setSavedAppendicesTags,

        newAppendicesTagsSelectHandleChange,
        savedAppendicesTagsSelectHandleChange
      }}>
        {children}
      </TaskAppendicesTagsContext.Provider>
    </div>
  );
}

export default TaskAppendicesTagsContextProvider;