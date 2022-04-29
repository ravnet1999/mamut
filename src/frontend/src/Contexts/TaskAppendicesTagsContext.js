import React, {createContext, useState } from 'react';
import TagHandler from '../Handlers/TagHandler';
import AppendixHandler from '../Handlers/AppendixHandler';

export const TaskAppendicesTagsContext = createContext();

const TaskAppendicesTagsContextProvider = ({children}) => { 
  const tagsSelectPlaceholder = <div>Wyszukaj tagi lub  (min. 3 znaki)</div>;
  const tagsSelectFormatCreateLabel = userInput => `Utwórz nowy tag: ${userInput}`;
  const [tagsSelectDefaultOptions, setTagsSelectDefaultOptions] = useState([]);
  const minTagLength = 3;

  const isValidNewOption = (tagName) => {
    if(tagName.length < minTagLength) {        
      return false;
    }

    return true;
  };

  const [newAppendicesTags, setNewAppendicesTags] = useState([]);
  const [savedAppendicesTags, setSavedAppendicesTags] = useState([]);

  const tagsSelectPromiseOptions = inputValue => TagHandler.search(1, inputValue);

  const getTagsAdded = (oldTags, newTags) => {
    let tagsAdded = !oldTags ? newTags : newTags.filter(newTag => !oldTags.includes(newTag));
    return tagsAdded;
  }

  const getTagsDeleted = (oldTags, newTags, appendixId) => {
    let tagsDeleted = !oldTags ? [] : oldTags.filter(oldTag => !newTags.includes(oldTag));
    return tagsDeleted;
  }

  const newAppendicesTagsSelectHandleChange = setResponse => selectedOptions => {
    let tagsAdded = getTagsAdded(newAppendicesTags, selectedOptions);
    let tagsDeleted = getTagsDeleted(newAppendicesTags, selectedOptions);

    if(tagsAdded.length) {
      if(selectedOptions.length == 1) {        
        setResponse({
          error: false,
          messages: ['Dodano tag. Teraz możesz załadować załącznik.']
        });
      } else {
        setResponse({
          error: false,
          messages: ['Dodano tag.']
        });  
      }      
    } else if(tagsDeleted.length) {
      let tagDeletedName = tagsDeleted[0].label;

      if(newAppendicesTags.length == 1 && newAppendicesTags[0].label == tagDeletedName) {
        setResponse({
          error: false,
          messages: ['Usunięto wszystkie tagi. Dodaj nowe, aby załadować załącznik.']
        });
      } else {
        setResponse({
          error: false,
          messages: ['Usunięto tag.']
        });  
      }
    }

    setNewAppendicesTags(selectedOptions);
  };

  
  const savedAppendicesTagsSelectHandleAddition = async (appendixId, appendices, setAppendices, tagsAdded, setResponse) => {
    let tagAddedName = tagsAdded[0].label;

    if(tagAddedName.length < 3) {
      setResponse({
        error: true,
        messages: ['Tag musi mieć co najmniej 3 znaki.']
      }); 
      return;  
    }

    let results = await AppendixHandler.addTags(appendixId, tagAddedName);
    
    let appendicesUpdated = appendices.map(appendix => {
      if(appendix.id == appendixId) {  
        if(!appendix.tagi) appendix.tagi = [];
        appendix.tagi[results.resources[0].id] = tagAddedName;
      }
      return appendix;
    });

    setAppendices([...appendicesUpdated]); 

    setResponse({
      error: false,
      messages: ['Pomyślnie dodano tag do załącznika.']
    });  
  };

  const savedAppendicesTagsSelectHandleDeletion = async (appendix, appendixId, appendices, setAppendices, tagsDeleted, setResponse) => {    
    let tagDeletedName = tagsDeleted[0].label;

    let savedTags = Object.entries(appendix.tagi);

    if(savedTags.length == 1 && savedTags[0][1] == tagDeletedName) {
      setResponse({
        error: true,
        messages: ['Nie można usunąć jedynego tagu do załącznika.']
      }); 
      return;
    }

    let tagId = savedTags.filter(tag => tag[1] == tagDeletedName)[0][0];

    await AppendixHandler.deleteTag(appendixId, tagId);

    let appendicesUpdated = appendices.map(appendix => {
      if(appendix.id == appendixId) {                    
        delete appendix.tagi[tagId];
      }
      return appendix;
    });
    
    setAppendices([...appendicesUpdated]);

    setResponse({
      error: false,
      messages: ['Pomyślnie usunięto tag do załącznika.']
    });  
  };

  const savedAppendicesTagsSelectHandleChange = (appendix, appendices, setAppendices, setResponse) =>  async (selectedOptions) => { 
    let appendixId = appendix.id;

    let tagsAdded = getTagsAdded(savedAppendicesTags[appendixId], selectedOptions);
    let tagsDeleted = getTagsDeleted(savedAppendicesTags[appendixId], selectedOptions);

    if(tagsAdded.length) {
      savedAppendicesTagsSelectHandleAddition(appendixId, appendices, setAppendices, tagsAdded, setResponse);
    } else if(tagsDeleted.length) {
      savedAppendicesTagsSelectHandleDeletion(appendix, appendixId, appendices, setAppendices, tagsDeleted, setResponse);
    } 
  };

  return (
    <div>
      <TaskAppendicesTagsContext.Provider value={{ 
        tagsSelectPlaceholder,
        tagsSelectFormatCreateLabel,
        tagsSelectPromiseOptions,  
        tagsSelectDefaultOptions, setTagsSelectDefaultOptions,
        isValidNewOption,

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