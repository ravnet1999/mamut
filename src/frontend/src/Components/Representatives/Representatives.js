import React, { useState, useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom';
import Page from '../Page';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import Modal from '../Modal/Modal';
import './Representatives.css';

const Representatives = (props) => {
    const [representatives, setRepresentatives] = useState([]);
    const [selectedRep, setSelectedRep] = useState(null);
    const [response, setResponse] = useState(null);
    const [taskStarted, setTaskStarted] = useState(false);
    const [tasksVisible, setTasksVisible] = useState(false);
    const [activeTasksModal, setActiveTasksModal] = useState({
        title: '',
        description: ''
    });

    useEffect(() => {
        props.setCurrentPage(props.history.location.pathname);
        ClientHandler.getRepresentatives(props.match.params.clientId).then((response) => {
            let sorted = response.resources.sort((a, b) => {
                return (a.imie + a.nazwisko) > (b.imie + b.nazwisko) ? 1 : ( (a.imie + a.nazwisko) < (b.imie + b.nazwisko) ? -1 : 0 );
            });
            setRepresentatives(sorted);
            response.messages = ['Wybierz reprezentanta:']
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });

        return props.updateTaskCount;
    }, []);

    const createTask = () => {
        setTaskStarted(true);
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

    const sortTasks = (activeTasks) => {
        let operators = {};
        activeTasks.map((activeTask) => {
            operators[activeTask.operator.inicjaly ? activeTask.operator.inicjaly : 'Brak inicjałów'] = [];
        });
        for(let operator in operators) {
            operators[operator] = activeTasks.filter((activeTask) => {
                return activeTask.operator.inicjaly == operator;
            });
        }

        let sortedInitials = Object.keys(operators).sort((a, b) => {
            return a.localeCompare(b)
        });

        let sortedOperators = {};

        sortedInitials.map((initials) => {
            sortedOperators[initials] = operators[initials];
        });

        return sortedOperators;
    }

    const showTasks = (representative) => {
        let sortedTasks = sortTasks(representative.activeTasks);
        let sortedInitials = Object.keys(sortedTasks).sort((a, b) => {
            return a.localeCompare(b)
        });

        let taskList = [];

        for(let operator in sortedTasks) {
            taskList.push(
                <div key={operator}>
                    <strong className="operator-header">{operator == '--' ? 'ToDo' : operator}: {sortedTasks[operator].length}</strong>
                    {sortedTasks[operator].map((task, key) => {
                        // return <div key={key}><strong>ID:</strong> {task.id}, <strong>Opis:</strong> {task.opis ? task.opis.substr(0, 150) + (task.opis.length > 150 ? '...' : '') : 'Brak opisu'}, <strong>Ostatni etap:</strong> {task.lastEpisode ? task.lastEpisode.rozwiazanie : ''}</div>
                        return (
                            <div key={key} className="active-task">
                                <div><strong>ID:</strong> {task.id}</div><div><strong>Opis:</strong> {task.opis ? task.opis.substr(0, 150) + (task.opis.length > 150 ? '...' : '') : 'Brak opisu'}</div><div><strong>Ostatni etap:</strong> {task.lastEpisode ? task.lastEpisode.rozwiazanie.substr(0, 150) + (task.lastEpisode.rozwiazanie.length > 150 ? '...' : '') : 'Brak opisu etapu.'} </div>
                            </div>
                        )
                    })}
                </div>
            )
        }

        // let taskList = representative.activeTasks.map((task, key) => {
        //     return ( 
        //         <div key={key}>
        //             <span className="operator-header"></span>
        //             <div key={key}>
        //                 <div><strong>Operator: </strong>{task.operator.inicjaly}</div><div><strong>ID:</strong> {task.id}</div><div><strong>Opis:</strong> {task.opis ? task.opis.substr(0, 150) + (task.opis.length > 150 ? '...' : '') : 'Brak opisu'}</div><div><strong>Ostatni etap:</strong> {task.lastEpisode ? task.lastEpisode.rozwiazanie.substr(0, 150) + (task.lastEpisode.rozwiazanie.length > 150 ? '...' : '') : 'Brak opisu etapu.'} </div>
        //             </div>
        //         </div>
        //     );
        // });
        setActiveTasksModal({
            title: `Aktywne zadania dla ${representative.imie} ${representative.nazwisko}`,
            description: taskList
        });
        setTasksVisible(true);
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
            <Modal buttons={[]} closeButtonName={'Zamknij'} title={activeTasksModal.title} description={activeTasksModal.description} visible={tasksVisible} onClose={() => setTasksVisible(false)}></Modal>
            <Alert response={response}></Alert>
            { buildClients() }
            <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            {/* <Alert response={response}></Alert> */}
                            <Button onClick={(e) => createTask()} className="btn-inverted btn-start btn-center" disabled={!selectedRep || taskStarted}>Start</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Page>
    );
}

export default Representatives;