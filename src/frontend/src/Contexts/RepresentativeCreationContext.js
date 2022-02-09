import React, { createContext, useReducer } from 'react';
import RepresentativeCreationReducer from '../Reducers/RepresentativeCreationReducer';
import { hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal, updateForm, setResponse, setClient, setLocation, setClients, setLocations, clearAllFields, clearResponse } from '../Actions/RepresentativeCreationActions';
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
      clients: [],
      locations: []
    }
  );

  const setField = (e) => {
    e.persist();
    dispatch(updateForm(e));    
  }

  const sendForm = (e) => {
    e.preventDefault();
    
    UserHandler.create({
      'imie': state.form.firstname, 
      'nazwisko': state.form.name, 
      'tel_komorkowy': state.form.phone, 
      'adres_email': state.form.email, 
      'id_klienta': state.client, 
      'lokalizacja': state.location
    }).then((response) => {            
      dispatch(setResponse(response));

      if(response.error === false) {
        dispatch(clearAllFields());
      }

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

  const buildLocationOptionName = (location) => {
    const propNames = ['nazwa','nip','ulica','kod_pocztowy','miasto'];
    const props = propNames.map(propName => location[propName]);
    const propsNotEmpty = props.filter(prop => prop.length > 0);
    return propsNotEmpty.join(", ");
  }

  const buildLocationOptions = () => {
    let options = state.locations.map((location, index) =>  <option value={location.id} selected={state.location == location.id ? "selected" : ""}>{ buildLocationOptionName(location) }</option>);
    options.unshift(<option value="" selected={state.location == "" ? "selected" : ""}>Wybierz lokalizację</option>);
    return options;  
  }

  return (
    <div>
      <RepresentativeCreationContext.Provider value={{ ...state, dispatch, hideRepCreationFormModal, showRepCreationFormModal, updateRepCreationFormModal, setField, sendForm, buildClientSelect, buildLocationSelect, setClients, setLocations, clearAllFields, clearResponse }} >
        {children}
      </RepresentativeCreationContext.Provider>
    </div>
  );
}

export default RepresentativeCreationContextProvider;