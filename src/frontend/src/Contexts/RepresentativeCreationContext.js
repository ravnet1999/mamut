import React, {createContext, useReducer } from 'react';
import RepresentativeCreationReducer from '../Reducers/RepresentativeCreationReducer';
import UserHandler from '../Handlers/UserHandler';
import { hideRepCreationForm, showRepCreationForm } from '../Actions/RepresentativeCreationActions';

export const RepresentativeCreationContext = createContext();

const RepresentativeCreationContextProvider = ({children}) => {
  const [ state, dispatch ] = useReducer(
    RepresentativeCreationReducer, {
      repCreationFormVisible: false, 
      repCreationFormModal: {
          title: '',
          description: ''
      }
    }
  );

  return (
    <div>
      <RepresentativeCreationContext.Provider value={{ ...state, dispatch, hideRepCreationForm, showRepCreationForm }} >
        {children}
      </RepresentativeCreationContext.Provider>
    </div>
  );
}

export default RepresentativeCreationContextProvider;