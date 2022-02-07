import React, {createContext, useReducer } from 'react';
import RepresentativeCreationReducer from '../Reducers/RepresentativeCreationReducer';
import { hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal, updateForm, setResponse } from '../Actions/RepresentativeCreationActions';
import UserHandler from '../Handlers/UserHandler';

export const RepresentativeCreationContext = createContext();

const RepresentativeCreationContextProvider = ({children}) => {
  const [ state, dispatch ] = useReducer(
    RepresentativeCreationReducer, {
      repCreationFormModalVisible: false, 
      repCreationFormModal: {
          title: '',
          description: ''
      },
      form: {
        firstname: '',
        name: '',
        email: '',
        phone: ''
      },
      response: null
    }
  );

  const setField = (e) => {
    e.persist();
    dispatch(updateForm(e));
  }

  const sendForm = (e) => {
    e.preventDefault();

    UserHandler.create(state.form.firstname, state.form.name, state.form.email, state.form.phone).then((response) => {            
      dispatch(setResponse(response));
      // dispatch(hideRepCreationFormModal());
      return;
    }).catch((err) => {
      dispatch(setResponse(err));
      return;
    });
  }

  return (
    <div>
      <RepresentativeCreationContext.Provider value={{ ...state, dispatch, hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal,  setField, sendForm }} >
        {children}
      </RepresentativeCreationContext.Provider>
    </div>
  );
}

export default RepresentativeCreationContextProvider;