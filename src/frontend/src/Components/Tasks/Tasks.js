import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from '../bootstrap';
import './Tasks.css';
import Page from '../Page';
import Alert from '../Alert/Alert';
import TaskHandler from '../../Handlers/TaskHandler';
import TaskReassign from './TaskReassign';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal/Modal';

const Tasks = (props) => {
    
    const [response, setResponse] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [pickedTask, setPickedTask] = useState(null);
    const [closeDisabledId, setCloseDisabledId] = useState(null);
    const [taskStarted, setTaskStarted] = useState(false);
    const [modal, setModal] = useState({
        title: '',
        description: '',
        buttons: []
    });
    const [modalVisible, setModalVisible] = useState(false);

    const getTasks = () => {
        props.setCurrentPage(props.history.location.pathname);
        TaskHandler.getTasks(props.match.params.general ? true : false).then((response) => {
            console.log(response);
            setResponse(response);
            setTasks(response.resources);
            if(response.resources.length > 0) {
                setPickedTask(response.resources[0]);
            }
            setCloseDisabledId(null);
        }).catch((err) => {
            setResponse(err);
        });
    }

    const startTask = () => {
        setTaskStarted(true);
        TaskHandler.startTask(pickedTask.id).then((response) => {
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        })
    }

    useEffect(() => {
        setResponse({
            error: false,
            messages: ['Pobieranie zadań...'],
            resources: []
        })
        getTasks();

        return props.updateTaskCount;
    }, [props.match.params.general]);

    const closeTask = (taskId) => {
        setCloseDisabledId(taskId);
        TaskHandler.closeTask(taskId).then((response) => {
            setResponse(response);
            getTasks();
        });
    }

    const buildTaskRadios = () => {
        return tasks.map((task, key) => {

            let taskStampClass = '';

            switch(task.lastStamp?.nazwa) {
                case 'OCZEKUJE':
                    taskStampClass = 'awaiting';
                    break;
                case 'START':
                    taskStampClass = 'started';
                    break;
                case 'STOP':
                    taskStampClass = 'stopped';
                    break;
                case 'nowy etap':
                    taskStampClass = 'new';
                    break;
                default:
                    taskStampClass = '';
                    break;
            }

            let isChecked = pickedTask ? (pickedTask.id == task.id ? true : false) : false;

            return (
                <Row key={key}>
                    <Col xs="12">
                        <div className={`tasklist-task ${taskStampClass} margin-bottom-default`}>
                            <Form.Check
                                type="radio"
                                label={`${task.id} - ${task.zglaszajacy}`}
                                id={`task_${task.id}`}
                                onChange={(e) => setPickedTask(task)}
                                checked={isChecked}
                                className={`d-inline-block vertical-middle-static ${isChecked ? 'picked' : ''}`}
                            >
                            </Form.Check>
                            <span className={`task-description description ${taskStampClass} vertical-middle-static d-inline-block`}> - {task.lastStamp?.nazwa}</span><br />
                            {task.opis ? <div className="task-main-description">{task.opis.substring(0, 50)}{task.opis.length > 50 ? '...' : ''}</div> : '' }
                            { task.lastStamp?.nazwa == 'OCZEKUJE' && !task.informatyk == 0 ? <Button className="position-right-middle small circular" onClick={(e) => { setModal({
                                title: `Czy na pewno chcesz zamknąć zadanie ${task.id} - ${task.zglaszajacy}?`,
                                description: '',
                                buttons: [
                                    {
                                        name: 'Potwierdź',
                                        method: () => {
                                            closeTask(task.id);
                                            setModalVisible(false);
                                        }
                                    }
                                ]
                            }); setModalVisible(true); } } disabled={closeDisabledId == task.id}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></Button> : '' }
                        </div>
                    </Col>
                </Row>
            );
        });
    }

    return (
        <Page>
            <Modal title={modal.title} description={modal.description} buttons={modal.buttons} visible={modalVisible} onClose={() => setModalVisible(false)}></Modal>
            <Alert response={response}></Alert>
            {buildTaskRadios()}
            {/* <Row className="margin-top-default margin-bottom-default">
                <Col className="text-center">
                    <Button className="large" onClick={(e) => startTask()}>Start</Button>    
                </Col>
            </Row> */}
            <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            <Button onClick={(e) => startTask()} className="btn-inverted btn-center btn-center" disabled={(tasks ? tasks.length == 0 : true) || taskStarted}>Start</Button>    
                        </Col>
                    </Row>
                    { pickedTask && tasks.length > 0 ? <TaskReassign taskId={pickedTask.id} reassignFinished={getTasks} redirect='/admin/tasks/general'></TaskReassign> : ''}
                </div>
            </div>
        </Page>
    );
}

export default Tasks;