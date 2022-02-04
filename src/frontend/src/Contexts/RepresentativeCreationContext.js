import React, {createContext, useReducer } from 'react';
import RepresentativeCreationReducer from '../Reducers/RepresentativeCreationReducer';
import UserHandler from '../Handlers/UserHandler';
import {  } from '../Actions/RepresentativeCreationActions';

export const RepresentativeCreationContext = createContext();

const RepresentativeCreationContextProvider = ({children}) => {
  const [ state, dispatch ] = useReducer(
    RepresentativeCreationReducer, {
    }
  );

  return (
    <div>
      <RepresentativeCreationContext.Provider value={{ ...state, dispatch }} >
        {children}
      </RepresentativeCreationContext.Provider>
    </div>
  );
}

export default RepresentativeCreationContextProvider;