import React, {createContext, useReducer } from 'react';
import RepresentativeSearchReducer from '../Reducers/RepresentativeSearchReducer';

export const RepresentativeSearchContext = createContext();

const RepresentativeSearchContextProvider = ({children}) => {
  const [ state, dispatch ] = useReducer(
    RepresentativeSearchReducer, {
      value: '',
      suggestions: [],
      response: { messages: []},
      selectedClientId: null,
      selectedRepId: null,
      taskStarted: false,
      test: "test"
    }
  );
  const test2 = "test2";

  return (
    <div>
      <RepresentativeSearchContext.Provider value={{ ...state, dispatch }} >
        {children}
      </RepresentativeSearchContext.Provider>
    </div>
  );
}

export default RepresentativeSearchContextProvider;