import React, {useState, useEffect} from 'react';
import { Form, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';

const ClientDocumentation = (props) => {
  const [response, setResponse] = useState(null);

  const [form, setForm] = useState({
    documentation: ''
  });

  const [client, setClient] = useState(null);

  const setField = (e) => {
    e.persist();
    setForm({...form, documentation: e.target.value});  
  }
  
  const sendForm = event => async (clientId) => {  
    event.preventDefault();
    
    try {
      let response = await ClientHandler.updateDocumentation(clientId, form.documentation);
      setClient({...client, dokumentacja: form.documentation});
      setResponse(response);       
    } catch(err) {
      setResponse(err);
      setForm({...form, documentation: client.dokumentacja}); 
    }
  }

  useEffect(() => {
    ClientHandler.getClients(props.clientId).then((response) => {  
      let clientData = response.resources[0];
      setClient(clientData);      
      setForm({...form, documentation: clientData.dokumentacja});        
    }).catch((err) => {
        
    });
  }, []);

  return (    
    <div>    
      <Alert response={response}></Alert>
      { client && <Form onSubmit={e => sendForm(e)(props.clientId)} className={"margin-top-default"}>
        <Form.Group controlId="formDocumentation">
          <Form.Label className={"margin-bottom-default"}>Dokumentacja klienta</Form.Label>
          <Form.Control type="text" name="documentacja" placeholder="Link do folderu OneDrive" onChange={setField} value={form.documentation} />
        </Form.Group>
        <Form.Group className="text" className={"margin-top-default"}>
          <Button variant="primary" type="submit">
            Zapisz
          </Button>
        </Form.Group>
      </Form>}
    </div>
  );
}

export default ClientDocumentation;