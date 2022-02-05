import React, {createContext, useReducer } from 'react';
import RepresentativeCreationReducer from '../Reducers/RepresentativeCreationReducer';
import { hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal } from '../Actions/RepresentativeCreationActions';

export const RepresentativeCreationContext = createContext();

const RepresentativeCreationContextProvider = ({children}) => {
  const [ state, dispatch ] = useReducer(
    RepresentativeCreationReducer, {
      repCreationFormModalVisible: false, 
      repCreationFormModal: {
          title: '',
          description: ''
      }
    }
  );

  return (
    <div>
      <RepresentativeCreationContext.Provider value={{ ...state, dispatch, hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal }} >
        {children}
      </RepresentativeCreationContext.Provider>
    </div>
  );
}

export default RepresentativeCreationContextProvider;