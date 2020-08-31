import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from '../bootstrap';
import Page from '../Page';
import Alert from '../Alert/Alert';
import OperatorHandler from '../../Handlers/OperatorHandler';
import TaskHandler from '../../Handlers/TaskHandler';

const Task = (props) => {

    const [operators, setOperators] = useState([]);
    const [response, setResponse] = useState(null);
    const [pickedOperator, setPickedOperator] = useState(null);

    useEffect(() => {
        OperatorHandler.getOperators().then((response) => {
            setResponse(response);
            setOperators(response.resources);
        }).catch((err) => {
            setResponse(err);
            setOperators([]);
        })
    }, []);

    const reassignTask = (operatorId) => {
        TaskHandler.reassignTask(props.match.params.taskId, operatorId).then((response) => {
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });
    }

    const buildOperatorsList = () => {
        let operatorsList = operators.map((operator, key) => {
            return (
                <Col xs="6" key={key}>
                    <Button className={`full-width margin-top-default ${pickedOperator ? ( pickedOperator.id == operator.id ? 'active' : '' ) : ''}`} onClick={(e) => setPickedOperator(operator)}>{operator.imie} {operator.nazwisko}</Button>
                </Col>
            );
        });

        return (
            <Row>
                {operatorsList}
            </Row>
        );
    }

    return (
        <Page>
            <Alert response={response}></Alert>
            <Row>
                <Col className="text-center">
                    <Button className="large">Stop</Button>
                </Col>
            </Row>
            <h1>Przekaż do:</h1>
            {buildOperatorsList()}
            <Row className="margin-top-default">
                <Col className="text-center">
                    <Button onClick={(e) => reassignTask(pickedOperator.id)} disabled={!pickedOperator}>Przekaż</Button>
                </Col>
            </Row>
        </Page>
    );
}

export default Task;