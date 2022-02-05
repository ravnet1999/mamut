import React, { useState } from 'react';

import { Form, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import UserHandler from '../../Handlers/UserHandler';

const RepresentativeCreationFormModal = (props) => {
  const [form, setForm] = useState({
    firstname: '',
    name: '',
    email: '',
    phone: ''
  });

  const { 
    dispatch, hideRepCreationFormModal
  } = props;

  const [response, setResponse] = useState(null);

  const setField = (e) => {
      e.persist();

      const newForm = {
          ...form
      };

      newForm[e.target.name] = e.target.value;

      setForm(newForm);
  }

  const sendForm = (e) => {
      e.preventDefault();

      UserHandler.create(form.firstname, form.name, form.email, form.phone).then((response) => {            
        setResponse(response);
        dispatch(hideRepCreationFormModal());
        return;
      }).catch((err) => {
        setResponse(err);
        return;
      });
  }

  return (    
    <>
    <h1>Dodawanie reprezentanta</h1>
      <Alert response={response}></Alert>
      <Form onSubmit={sendForm}>
        <Form.Group controlId="formBasicFistname">
          <Form.Label>Imię reprezentanta</Form.Label>
          <Form.Control type="text" name="firstname" placeholder="Imię reprezentanta" onChange={setField} value={form.firstname} />
        </Form.Group>

        <Form.Group controlId="formBasicName">
          <Form.Label>Nazwisko reprezentanta</Form.Label>
          <Form.Control type="text" name="name" placeholder="Nazwisko reprezentanta" onChange={setField} value={form.name} />
        </Form.Group>

        <Form.Group controlId="formBasicName">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="text" name="email" placeholder="E-mail" onChange={setField} value={form.email} />
        </Form.Group>

        <Form.Group controlId="formBasicName">
          <Form.Label>Telefon</Form.Label>
          <Form.Control type="text" name="phone" placeholder="Telefon" onChange={setField} value={form.phone} />
        </Form.Group>

        <Form.Group className="text-right">
          <Button variant="primary" type="submit">
              Dodaj
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default RepresentativeCreationFormModal;