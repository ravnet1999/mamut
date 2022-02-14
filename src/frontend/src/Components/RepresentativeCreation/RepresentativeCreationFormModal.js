import React from 'react';

import { Form } from '../bootstrap';
import Alert from '../Alert/Alert';

const RepresentativeCreationFormModal = (props) => {  
  const { setField, restrictInputFieldToNumbers, sendForm, form, response, buildClientSelect, buildLocationSelect, client, pickedClient } = props;

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

        <Form.Group controlId="formBasicEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="text" name="email" placeholder="E-mail" onChange={setField} value={form.email} />
        </Form.Group>

        <Form.Group controlId="formBasicName">
          <Form.Label>Telefon</Form.Label>
          <Form.Control type="text" name="phone" placeholder="Telefon (tylko liczby)" onChange={setField} onKeyPress={restrictInputFieldToNumbers} value={form.phone} />
        </Form.Group>

        { !pickedClient && buildClientSelect() }
        { buildLocationSelect(client) }
      </Form>
    </>
  );
}

export default RepresentativeCreationFormModal;