import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from '../bootstrap';
import Page from '../Page';
import Alert from '../Alert/Alert';
import OperatorHandler from '../../Handlers/OperatorHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import TaskReassign from './TaskReassign';

const Task = (props) => {

    const [task, setTask] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        setResponse({
            error: false,
            messages: ['Pobieranie zadania...']
        });

        TaskHandler.getTaskById(props.match.params.taskId).then((response) => {
            setResponse(response);
            setTask(response.resources[0]);
        }).catch((err) => {
            setResponse(err);
        });
    }, []);

    if (!task) return <Alert response={response}></Alert>;

    return (
        <Page>
            <Alert response={response}></Alert>
            <h1>{task.id} - {task.zglaszajacy}</h1>
            <Row>
                <Col className="text-center">
                    <Button className="large">
                        Stop
                    </Button>
                </Col>
            </Row>
            <TaskReassign taskId={props.match.params.taskId}></TaskReassign>
        </Page>
    );
}

export default Task;