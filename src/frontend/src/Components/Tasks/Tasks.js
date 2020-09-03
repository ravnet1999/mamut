import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from '../bootstrap';
import Page from '../Page';
import Alert from '../Alert/Alert';
import TaskHandler from '../../Handlers/TaskHandler';
import TaskReassign from './TaskReassign';

const Tasks = (props) => {
    
    const [response, setResponse] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [pickedTask, setPickedTask] = useState(null);

    useEffect(() => {
        setResponse({
            error: false,
            messages: ['Pobieranie zadań...'],
            resources: []
        })
        TaskHandler.getTasks().then((response) => {
            setResponse(response);
            setTasks(response.resources);
            if(response.resources.length > 0) {
                setPickedTask(response.resources[0]);
            }
        }).catch((err) => {
            setResponse(err);
        });
    }, []);

    const buildTaskRadios = () => {
        return tasks.map((task, key) => {
            return (
                <Row key={key}>
                    <Col>
                        <Form.Check
                            type="radio"
                            label={`${task.id} - ${task.zglaszajacy}`}
                            onChange={(e) => setPickedTask(task)}
                            checked={pickedTask ? (pickedTask.id == task.id ? true : false) : false}>
                        </Form.Check>
                    </Col>
                </Row>
            );
        });
    }

    return (
        <Page>
            <Alert response={response}></Alert>
            {buildTaskRadios()}
            <Row className="margin-top-default margin-bottom-default">
                <Col className="text-center">
                    <Button className="large">Start</Button>    
                </Col>
            </Row>
            { pickedTask ? <TaskReassign taskId={pickedTask.id}></TaskReassign> : ''}
        </Page>
    );
}

export default Tasks;