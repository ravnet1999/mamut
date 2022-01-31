import React, {createContext, useReducer } from 'react';
import RepresentativeSearchReducer from '../Reducers/RepresentativeSearchReducer';
import UserClientHandler from '../Handlers/UserClientHandler';
import UserHandler from '../Handlers/UserHandler';
import { setValue, setSuggestions, clearSuggestions, selectRep, setResponse, setSuccessResponse, setErrorResponse } from '../Actions/RepresentativeSearchActions';

export const RepresentativeSearchContext = createContext();

const RepresentativeSearchContextProvider = ({children}) => {
  const [ state, dispatch ] = useReducer(
    RepresentativeSearchReducer, {
      value: '',
      suggestions: [],
      response: { messages: []},
      selectedClientId: null,
      selectedRepId: null,
      selectedRep: null
    }
  );

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    value: state.value,
    onChange: (event, { newValue }) => { 
      dispatch(setValue(newValue))
    }
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => 
  `${suggestion.imie} ${suggestion.nazwisko}, ${!!(suggestion.tel_komorkowy)?suggestion.tel_komorkowy + ", ":""}${!!(suggestion.numer_wewnetrzny)?suggestion.numer_wewnetrzny + ", ":""}${suggestion.nazwa}`;

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
    <div>
      {getSuggestionValue(suggestion)}
    </div>
  );

  const onSuggestionsFetchRequested = async ({ value }) => {
    try{
      let result = await UserClientHandler.findByPhoneNumber(value);
      let suggestions = result.resources.resources;

      dispatch(setSuggestions(suggestions));
    } catch (err) {
      dispatch(setErrorResponse(err));
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    dispatch(clearSuggestions());
  };

  const onSuggestionSelected = async (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    const selectedRepId = suggestion.id;
    try {
      const response = await UserHandler.getWithTasks(selectedRepId);
      const selectedRep = response.resources[0];
      dispatch(selectRep({ selectedRep, selectedRepId, selectedClientId: suggestion.id_klienta })); 
    } catch(err) {
      dispatch(setErrorResponse(err));
    }
  }

  return (
    <div>
      <RepresentativeSearchContext.Provider value={{ ...state, dispatch, inputProps, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected, renderSuggestion, getSuggestionValue, setResponse, setSuccessResponse, setErrorResponse }} >
        {children}
      </RepresentativeSearchContext.Provider>
    </div>
  );
}

export default RepresentativeSearchContextProvider;