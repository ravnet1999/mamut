import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from '../bootstrap';
import './Tasks.css';
import Alert from '../Alert/Alert';
import OperatorHandler from '../../Handlers/OperatorHandler';
import TaskHandler from '../../Handlers/TaskHandler';

const TaskReassign = (props) => {

    const [operators, setOperators] = useState([]);
    const [response, setResponse] = useState(null);
    const [pickedOperator, setPickedOperator] = useState(0);

    useEffect(() => {
        OperatorHandler.getOperators().then((response) => {
            setOperators(response.resources);
        }).catch((err) => {
            setResponse(err);
            setOperators([]);
        })
    }, []);

    const reassignTask = (operatorId) => {
        if(props.updateDescriptions) {
            props.updateDescriptions();
        }
        TaskHandler.reassignTask(props.taskId, operatorId).then((response) => {
            setResponse(response);
            if(props.reassignFinished) {
                props.reassignFinished();
            }
        }).catch((err) => {
            setResponse(err);
        });
    }

    const buildOperatorsOptions = () => {
        return operators.map((operator, key) => {
            return <option key={key} value={operator.id}>{operator.imie} {operator.nazwisko}</option>
        });   
    }

    const buildOperatorsSelect = () => {
        return (
            <select className="form-control" onChange={(e) => setPickedOperator(e.target.value) } value={pickedOperator}>
                {buildOperatorsOptions()}
            </select>
        );
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
        <Row className="margin-top-default no-margins reassign-task">
            <Col xs="12">
                <h2>Przekaż do:</h2>
            </Col>
            <Col xs="8" sm="9" md="10">
                {/* {buildOperatorsList()} */}
                {buildOperatorsSelect()}
            </Col>
            <Col xs="4" sm="3" md="2" className="text-right">
                <Button className="margin-bottom-default btn-inverted" onClick={(e) => reassignTask(pickedOperator)}>Przekaż</Button>
            </Col>
            <Col xs="12" className="margin-top-default">
                <Alert response={response}></Alert>
            </Col>
        </Row>
    );
}

export default TaskReassign;