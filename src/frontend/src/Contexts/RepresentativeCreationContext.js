import React, { createContext, useReducer } from 'react';
import RepresentativeCreationReducer from '../Reducers/RepresentativeCreationReducer';
import { hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal, updateForm, setResponse, setClient, setLocation, setClients } from '../Actions/RepresentativeCreationActions';
import UserHandler from '../Handlers/UserHandler';
import { Form } from '../Components/bootstrap';

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
      client: '',
      location: '',
      response: null,
      clients: []
    }
  );

  const setField = (e) => {
    e.persist();
    dispatch(updateForm(e));    
  }

  const sendForm = (e) => {
    e.preventDefault();
    
    console.log(state.form.firstname, state.form.name, state.form.email, state.form.phone, state.client, state.location)

    UserHandler.create(state.form.firstname, state.form.name, state.form.email, state.form.phone).then((response) => {            
      dispatch(setResponse(response));
      // dispatch(hideRepCreationFormModal());
      return;
    }).catch((err) => {
      dispatch(setResponse(err));
      return;
    });
  }

  const buildClientSelect = () => {
    return <>
      <Form.Group controlId="client">
        <Form.Label>Firma</Form.Label>
        <Form.Control as="select" onChange={e => dispatch(setClient(e.target.value))}>
          { buildClientOptions() }
        </Form.Control>
      </Form.Group>
    </>;
  }

  const buildClientOptions = () => {
    let options = state.clients.map((client, index) =>  <option value={client.id} selected={state.client == client.id ? "selected" : ""}>{client.nazwa}</option>);
    options.unshift(<option value="" selected={state.client == "" ? "selected" : ""}>Wybierz firmę</option>);
    return options;      
  };

  const buildLocationSelect = () => {
    return <>
      <Form.Group controlId="location">
        <Form.Label>Lokalizacja</Form.Label>
        <Form.Control as="select" onChange={e => dispatch(setLocation(e.target.value))}>
          { buildLocationOptions() }
        </Form.Control>
      </Form.Group>
    </>;
  }

  const buildLocationOptions = () => {
    return <>   
      <option value="" selected={state.location == "" ? "selected" : ""}>Wybierz lokalizację</option>   
      <option value={Number(state.client)+1} selected={state.location == Number(state.client)+1 ? "selected" : ""}>{Number(state.client)+1}</option>
      <option value={Number(state.client)+2} selected={state.location == Number(state.client)+2 ? "selected" : ""}>{Number(state.client)+2}</option>
      <option value={Number(state.client)+3} selected={state.location == Number(state.client)+3 ? "selected" : ""}>{Number(state.client)+3}</option>
    </>;
  }

  return (
    <div>
      <RepresentativeCreationContext.Provider value={{ ...state, dispatch, hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal, setField, sendForm, buildClientSelect, buildLocationSelect, setClients }} >
        {children}
      </RepresentativeCreationContext.Provider>
    </div>
  );
}

export default RepresentativeCreationContextProvider;