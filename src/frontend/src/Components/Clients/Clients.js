import React, { useState, useEffect } from 'react';
import Page from '../Page';
import { Row, Col } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';
import { NavLink as Link } from 'react-router-dom';

const Clients = (props) => {
    const [clients, setClients] = useState([]);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        props.setCurrentPage(props.history.location.pathname);
        ClientHandler.getClients().then((response) => {
            let sorted = response.resources.sort((a, b) => {
                return (a.nazwa) > (b.nazwa) ? 1 : ( (a.nazwa) < (b.nazwa) ? -1 : 0 );
            });
            setClients(sorted);
            response.messages = ['Wybierz klienta, którego będziesz obsługiwał:']
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });

        return props.updateTaskCount;
    }, []);

    const buildClients = () => {
        let clientColumns = clients.map((client, index) => {
            return <Col xs="12" sm="12" md="6" key={index}><Link to={`/representatives/${client.id}`} className="btn btn-primary full-width margin-bottom-default">{client.nazwa}</Link> </Col>;
        });

        return (
            <Row>
                {clientColumns}
            </Row>
        );
    }

    return (        
        <Page>
            <Alert response={response}></Alert>
            { buildClients() }
        </Page>
    );
}

export default Clients;