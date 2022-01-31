import React, { useState, useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom';
import Page from '../Page';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import Modal from '../Modal/Modal';
import TaskPreview from '../Tasks/TaskPreview';
import './Representatives.css';

import { TaskContext } from '../../Contexts/TaskContext';
import {WithContexts} from '../../HOCs/WithContexts'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
const Representatives = (props) => {
    const [representatives, setRepresentatives] = useState([]);
    const [selectedRep, setSelectedRep] = useState(null);
    const [response, setResponse] = useState(null);
    
    const { 
      taskStarted, setTaskStarted, createTask, tasksVisible, setTasksVisible, takeOverStarted, setTakeOverStarted, viewedOperator, setViewedOperator, viewedTaskList, setViewedTaskList, activeTasksModal, setActiveTasksModal, taskForTakeOver, setTaskForTakeOver, takeOverModalVisible, setTakeOverModalVisible, takeOverButtonDisabled, setTakeOverButtonDisabled, takeOverModal, setTakeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, setPreviewedTask, sortTasks  
    } = props;
  
    const createTaskAndRenderResponse = (event) => {
      setResponse({
          error: false,
          messages: ['Tworzenie zadania...']
      });

      createTask(selectedRep.id, props.match.params.clientId)
      .then(result => setResponse(result))
      .catch(err => setResponse(err));
    }
  
    useEffect(() => {
        props.setCurrentPage(props.history.location.pathname);
        ClientHandler.getSortedRepresentatives(props.match.params.clientId).then((response) => {
            let sorted = response.resources;
            setRepresentatives(sorted);
            response.messages = ['Wybierz reprezentanta:']
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });

        return props.updateTaskCount;
    }, []);

    useEffect(() => {
        if(!viewedOperator) return () => {

        };

        let sortedTasks = sortTasks(viewedOperator.activeTasks);

        let taskList = [];

        for(let operator in sortedTasks) {
            taskList.push(
                <div key={operator}>
                    <strong className="operator-header">{operator == '--' ? 'ToDo' : operator}: {sortedTasks[operator].length}</strong>
                    {sortedTasks[operator].map((task, key) => {
                        // return <div key={key}><strong>ID:</strong> {task.id}, <strong>Opis:</strong> {task.opis ? task.opis.substr(0, 150) + (task.opis.length > 150 ? '...' : '') : 'Brak opisu'}, <strong>Ostatni etap:</strong> {task.lastEpisode ? task.lastEpisode.rozwiazanie : ''}</div>
                        return (
                            <div key={key} className="active-task">
                                <div className="hover-cursor hover-underline" onClick={(e) => previewTask(task)}><strong>ID:</strong> {task.id}</div><div><strong>Opis:</strong> {task.opis ? task.opis.substr(0, 150) + (task.opis.length > 150 ? '...' : '') : 'Brak opisu'}</div><div><strong>Ostatni etap:</strong> {task.lastEpisode ? task.lastEpisode.rozwiazanie.substr(0, 150) + (task.lastEpisode.rozwiazanie.length > 150 ? '...' : '') : 'Brak opisu etapu.'} </div>
                                <div className="text-right top-right takeover-button"><Button className="small circular task-takeover" onClick={(e) => takeOverTask(task)} disabled={takeOverStarted}><span className="icon-center takeover"><FontAwesomeIcon icon={faPlay}></FontAwesomeIcon></span></Button></div>
                            </div>
                        )
                    })}
                </div>
            )
        }

        setViewedTaskList(taskList);        
    }, [viewedOperator, takeOverStarted])

    useEffect(() => {
        if(!viewedOperator) return () => {

        };

        setActiveTasksModal({
            title: `Aktywne zadania dla ${viewedOperator.imie} ${viewedOperator.nazwisko}`,
            description: viewedTaskList
        });
        setTasksVisible(true);
    }, [viewedTaskList]);

    useEffect(() => {
        if(!takeOverModalVisible || !taskForTakeOver) return () => {

        };

        console.log('refreshing modal');

        setTakeOverModal({
            title: `Przejęcie zadania ${taskForTakeOver.id} - ${taskForTakeOver.zglaszajacy}`,
            description: `Czy na pewno chcesz przejąć zadanie ${taskForTakeOver.id} - ${taskForTakeOver.zglaszajacy} klienta ${taskForTakeOver.klient}?`,
            buttons: [
                {
                    name: 'Potwierdź',
                    method: () => {
                        setTakeOverStarted(true);
                        TaskHandler.reassignTask(taskForTakeOver.id, undefined, true).then((result) => {
                            setTakeOverStarted(false);
                            setTakeOverModalVisible(false);
                            window.location.replace(`/admin/task/${taskForTakeOver.id}`);
                        }).catch((err) => {
                            console.log(err);
                            setTakeOverStarted(false);
                            setTakeOverModalVisible(false);
                        });
                    },
                    disabled: {
                        status: takeOverStarted
                    }
                }
            ]
        })

    }, [takeOverModalVisible, taskForTakeOver, takeOverStarted]);    

    const previewTask = (task) => {
        setPreviewedTask(task);
        setTaskPreviewVisible(true);
    }
    
    const takeOverTask = (task) => {
        setTaskForTakeOver(task);
        setTakeOverModalVisible(true);
    }

    const showTasks = (representative) => {
        console.log('test');
        console.log(representative);
        setViewedOperator(representative);
    }

    const buildClients = () => {
        
        let clientColumns = representatives.map((representative, index) => {
        return <Col xs="12" sm="12" md="6" lg="4" key={index}>
                <Button onClick={(e) => setSelectedRep(representative)} className={ `full-width margin-bottom-default ${ selectedRep && selectedRep.id === representative.id ? 'active' : ''}` }>
                    {representative.imie} {representative.nazwisko}
                    <span className="task-count" onClick={() => showTasks(representative)}>
                        {representative.activeTasks.length > 0 ? `(${representative.activeTasks.length})` : ''}
                    </span>
                </Button>
            </Col>;
        });

        return (
            <Row>
                {clientColumns}
            </Row>
        );
    }

    return (
        <Page>
            { taskPreviewVisible ? <TaskPreview task={previewedTask} onClose={() => setTaskPreviewVisible(false)}></TaskPreview> : '' }
            <Modal className="takeover-modal" buttons={takeOverModal.buttons} closeButtonName={'Zamknij'} title={takeOverModal.title} description={takeOverModal.description} visible={takeOverModalVisible} onClose={() => setTakeOverModalVisible(false)}></Modal>
            <Modal buttons={[]} closeButtonName={'Zamknij'} title={activeTasksModal.title} description={activeTasksModal.description} visible={tasksVisible} onClose={() => setTasksVisible(false)}></Modal>
            <Alert response={response}></Alert>
            { buildClients() }
            <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            {/* <Alert response={response}></Alert> */}
                            <Button onClick={(e) => createTaskAndRenderResponse()} className="btn-inverted btn-start btn-center" disabled={!selectedRep || taskStarted}>Start</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Page>
    );
}

export default WithContexts(Representatives, [ TaskContext ]);