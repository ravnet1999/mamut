import React, { useState, useEffect } from 'react';
import Page from '../Page';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';
import { NavLink as Link } from 'react-router-dom';

const Representatives = (props) => {
    const [representatives, setRepresentatives] = useState([]);
    const [selectedRep, setSelectedRep] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        ClientHandler.getRepresentatives(props.match.params.clientId).then((response) => {
            console.log('logging', response);
            let sorted = response.resources.sort((a, b) => {
                return (a.imie + a.nazwisko) > (b.imie + b.nazwisko) ? 1 : ( (a.imie + a.nazwisko) < (b.imie + b.nazwisko) ? -1 : 0 );
            });
            setRepresentatives(sorted);
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });
    }, []);

    const buildClients = () => {
        
        let clientColumns = representatives.map((representative, index) => {
            return <Col xs="6" key={index}><Button to={`/task/${props.match.params.clientId}/${representative.id}`} className="btn btn-primary full-width margin-bottom-default">{representative.imie} {representative.nazwisko}</Button> </Col>;
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

export default Representatives;