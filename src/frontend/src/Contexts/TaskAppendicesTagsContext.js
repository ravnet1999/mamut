import React, {createContext, useState } from 'react';
import TagHandler from '../Handlers/TagHandler';
import AppendixHandler from '../Handlers/AppendixHandler';

export const TaskAppendicesTagsContext = createContext();

const TaskAppendicesTagsContextProvider = ({children}) => { 
  const tagsSelectPlaceholder = <div>Wyszukaj tag lub dodaj nowy (min. 3 znaki)</div>;
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
  const [savedAppendicesTagsLoaded, setSavedAppendicesTagsLoaded] = useState(false);

  const tagsSelectPromiseOptions = inputValue => TagHandler.search(1, inputValue);

  const newAppendicesTagsSelectHandleChange = setResponse => (selectedOptions, context) => {
    if(['select-option', 'create-option'].includes(context.action)) {
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
    } else if(context.action == 'remove-value') {
      if(newAppendicesTags.length == 1) {
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

  
  const savedAppendicesTagsSelectHandleAddition = async (appendixId, appendices, setAppendices, tagAddedName, setResponse) => {
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

  const savedAppendicesTagsSelectHandleDeletion = async (appendix, appendixId, appendices, setAppendices, tagDeletedName, setResponse) => {    
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

  const savedAppendicesTagsSelectHandleChange = (appendix, appendices, setAppendices, setResponse) =>  async (selectedOptions, context) => { 
    let appendixId = appendix.id;
    
    if(['select-option', 'create-option'].includes(context.action)) {
      savedAppendicesTagsSelectHandleAddition(appendixId, appendices, setAppendices, context.option.label, setResponse);  
    } else if(context.action == 'remove-value') {
      savedAppendicesTagsSelectHandleDeletion(appendix, appendixId, appendices, setAppendices, context.removedValue.label, setResponse);
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
        savedAppendicesTagsLoaded, setSavedAppendicesTagsLoaded,

        newAppendicesTagsSelectHandleChange,
        savedAppendicesTagsSelectHandleChange
      }}>
        {children}
      </TaskAppendicesTagsContext.Provider>
    </div>
  );
}

export default TaskAppendicesTagsContextProvider;