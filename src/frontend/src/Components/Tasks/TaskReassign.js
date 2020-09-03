import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import OperatorHandler from '../../Handlers/OperatorHandler';
import TaskHandler from '../../Handlers/TaskHandler';

const TaskReassign = (props) => {

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
        TaskHandler.reassignTask(props.taskId, operatorId).then((response) => {
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
        <Row>
            <Col>
                <h2>Przekaż do:</h2>
                {buildOperatorsList()}
                <Row className="margin-top-default">
                    <Col className="text-center">
                        <Alert response={response}></Alert>
                        <Button onClick={(e) => reassignTask(pickedOperator.id)} disabled={!pickedOperator}>Przekaż</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default TaskReassign;