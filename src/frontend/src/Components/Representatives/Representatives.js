import React, { useState, useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom';
import Page from '../Page';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';
import TaskHandler from '../../Handlers/TaskHandler';

const Representatives = (props) => {
    const [representatives, setRepresentatives] = useState([]);
    const [selectedRep, setSelectedRep] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        ClientHandler.getRepresentatives(props.match.params.clientId).then((response) => {
            let sorted = response.resources.sort((a, b) => {
                return (a.imie + a.nazwisko) > (b.imie + b.nazwisko) ? 1 : ( (a.imie + a.nazwisko) < (b.imie + b.nazwisko) ? -1 : 0 );
            });
            setRepresentatives(sorted);
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });
    }, []);

    const createTask = () => {
        setResponse({
            error: false,
            messages: ['Tworzenie zadania...']
        });
        TaskHandler.createTask(props.match.params.clientId, selectedRep.id).then((result) => {
            setResponse(result);
        }).catch((err) => {
            setResponse(err);
        });
    }

    const buildClients = () => {
        
        let clientColumns = representatives.map((representative, index) => {
            return <Col xs="6" key={index}><Button onClick={(e) => setSelectedRep(representative)} className={ `full-width margin-bottom-default ${ selectedRep && selectedRep.id === representative.id ? 'active' : ''}` }>{representative.imie} {representative.nazwisko}</Button> </Col>;
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
            <Row>
                <Col className="text-center">
                    <Alert response={response}></Alert>
                    <Button className="large" onClick={(e) => createTask()} disabled={!selectedRep}>Start</Button>
                </Col>
            </Row>
        </Page>
    );
}

export default Representatives;