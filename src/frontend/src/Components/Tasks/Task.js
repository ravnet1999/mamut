import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from '../bootstrap';
import { Redirect } from 'react-router-dom';
import Page from '../Page';
import Alert from '../Alert/Alert';
import OperatorHandler from '../../Handlers/OperatorHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import ServiceHandler from '../../Handlers/ServiceHandler';
import ClientHandler from '../../Handlers/ClientHandler';
import TaskReassign from './TaskReassign';
import Modal from '../Modal/Modal';
import './Tasks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import appConfig from '../../Config/appConfig.json';

const Task = (props) => {
    const [options, setOptions] = useState(null);
    const [task, setTask] = useState(null);
    const [response, setResponse] = useState(null);
    const [taskDescription, setTaskDescription] = useState(null);
    const [taskEpisodes, setTaskEpisodes] = useState(null);
    const [lastEpisode, setLastEpisode] = useState(null);
    const [lastEpisodeDescription, setLastEpisodeDescription] = useState('');
    const [repPhone, setRepPhone] = useState('');
    const [repEmail, setRepEmail] = useState('');
    const [rep, setRep] = useState(null);
    const [travel, setTravel] = useState(false);
    const [episodeCreateStarted, setEpisodeCreateStarted] = useState({
        status: false
    });
    const [episodeCreateChanged, setEpisodeCreateChanged] = useState(false);
    const [appState, setAppState] = useState({
        taskDescription: '',
        episodeDescription: '',
        travel: false
    });
    const [redirect, setRedirect] = useState(null);
    const [modal, setModal] = useState({
        title: '',
        description: '',
        buttons: []
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [lastEpisodeInput, setLastEpisodeInput] = useState(null);
    const [errorTypes, setErrorTypes] = useState([]);
    const [pickedErrorType, setPickedErrorType] = useState(null);

    const updateDescriptions = (callback = null) => {
        TaskHandler.updateLastEpisodeDescription(lastEpisode.id, appState.episodeDescription).then((result) => {
            TaskHandler.updateTaskDescription(task.id, appState.taskDescription).then((result) => {
                if(callback) {
                    callback();
                }
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    const updateRep = () => {
        if(!rep) return;

        ClientHandler.changeRepresentative(rep.id, rep).then((result) => {

        }).catch((err) => {
            console.log(err);
        });
    }

    const getTaskDescription = () => {
        return taskDescription;
    }

    useEffect(() => {
        setResponse({
            error: false,
            messages: ['Pobieranie zadania...']
        });

        TaskHandler.getTaskById(props.match.params.taskId).then((response) => {
            ClientHandler.getRepresentative(response.resources[0].id_zglaszajacy).then((rep) => {
                let representative = rep.resources[0];

                setRep(representative);
                setRepPhone(representative.tel_komorkowy);
                setRepEmail(representative.adres_email);

                setResponse(response);
                setTask(response.resources[0]);
                modifyTaskDescription(response.resources[0].opis)
                TaskHandler.getEpisodes(props.match.params.taskId).then((episodes) => {
                    setResponse(episodes);
                    setTaskEpisodes(episodes.resources);
                    setLastEpisode(episodes.resources[0]);
                    let newAppState = appState;
                    newAppState.travel = episodes.resources[0].forma_interwencji;
                    setTravel(episodes.resources[0].forma_interwencji);
                    setAppState(newAppState);
                    modifyEpisodeDescription(episodes.resources[0].rozwiazanie);
                }).catch((err) => {
                    setResponse(err);
                })
            });
        }).catch((err) => {
            setResponse(err);
        });
    }, []);

    useEffect(() => {
        ServiceHandler.getServices().then((response) => {
            setErrorTypes(response.resources);
        }).catch((err) => {
            console.log(err);
        })
    }, [errorTypes.length])

    // useEffect(() => {
    //     return () => {
    //         props.updateTaskCount();
    //         if(lastEpisode && task && (taskDescription !== null || lastEpisodeDescription !== null)) {
    //             updateDescriptions();
    //         }
    //     };
    // }, [lastEpisode, task]);

    // useEffect(() => {
    //     return () => {
    //         updateRep();
    //     }
    // }, [rep])

    useEffect(() => {
        if(!lastEpisode) return;

        return () => {
            TaskHandler.updateEpisodeTravel(lastEpisode.id, appState.travel ? 1 : 0).then((result) => {

            }).catch((err) => {
                console.log(err);
            });
        }
    }, [travel]);

    useEffect(() => {
        if(props.match.params.options) {
            setOptions(props.match.params.options.split(','));
        }
    }, [props.match.params.options])


    useEffect(() => {
        if(lastEpisodeInput && options && options.includes('focusLastEpisode')) {
            lastEpisodeInput.focus();
        }
    }, [lastEpisodeInput, options])

    const stopTask = () => {
        TaskHandler.stopTask(task.id).then((response) => {
            // setResponse(response);
            updateDescriptions();
            setRedirect(task.informatyk == 0 ? '/tasks/general' : '/tasks');
        }).catch((err) => {
            setResponse(err);
        });
    }

    const modifyTaskDescription = (value) => {
        let newState = appState;
        newState.taskDescription = value;
        setAppState(newState);
        setTaskDescription(value);

        props.updateTaskCount();
        if(lastEpisode && task && (taskDescription !== null || lastEpisodeDescription !== null)) {
            updateDescriptions();
        }
    }

    const modifyEpisodeDescription = (value) => {
        let newState = appState;
        newState.episodeDescription = value;
        setAppState(newState);
        setLastEpisodeDescription(value);

        props.updateTaskCount();
        if(lastEpisode && task && (taskDescription !== null || lastEpisodeDescription !== null)) {
            updateDescriptions();
        }
    }

    const toggleTravel = () => {
        let newState = appState;
        newState.travel = !travel;
        setAppState(newState);
        setTravel(newState.travel);
    }

    const createEpisode = (callback = null) => {
        setEpisodeCreateStarted({
            status: true
        });
        setEpisodeCreateChanged(true);
        TaskHandler.reassignTask(task.id).then((result) => {
            props.updateTaskCount();
            if(lastEpisode && task && (taskDescription !== null || lastEpisodeDescription !== null)) {
                updateDescriptions(() => {
                    TaskHandler.updateEpisodeTravel(lastEpisode.id, appState.travel ? 1 : 0).then((result) => {
                        if(callback) {
                            callback();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const buildLastEpisode = () => {;
        if(!lastEpisode) return '';

        return (
            <div className="form-group task-episode margin-bottom-default">
                <Modal title={modal.title} description={modal.description} buttons={modal.buttons} visible={modalVisible} onClose={() => setModalVisible(false)}></Modal>
                <Row>
                    <Col xs="4">
                        <strong>Bieżący etap</strong>:
                    </Col>
                    <Col xs="4" md="5" className="text-right">
                        <Button className="episode-create-button" onClick={(e) => { setModal({
                                title: `Czy na pewno chcesz utworzyć nowy etap?`,
                                description: '',
                                buttons: [
                                    {
                                        name: 'Potwierdź',
                                        method: () => {
                                            createEpisode(() => {
                                                setEpisodeCreateStarted({
                                                    status: false
                                                });
                                                setEpisodeCreateChanged(false);
                                                window.location.replace(window.location.href);
                                                return;
                                            });
                                            setModalVisible(false);
                                        },
                                        disabled: episodeCreateStarted
                                    }
                                ]
                        }); setModalVisible(true); } } disabled={episodeCreateStarted.status || modalVisible}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></Button>
                    </Col>
                    <Col xs="4" md="3" className="text-right">
                        <div className="travel-box">
                            <div>
                                <strong>Dojazd:</strong>
                            </div>
                            <div className="travel-switch">
                                <Form.Check inline label="Tak" type="radio" id="travel-yes" onChange={(e) => toggleTravel()} checked={travel}></Form.Check>
                                <Form.Check inline label="Nie" type="radio" id="travel-no" onChange={(e) => toggleTravel()} checked={!travel}></Form.Check>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="margin-top-reduced">Opis:</div>
                <textarea rows="3" ref={(textarea) => setLastEpisodeInput(textarea)} className="form-control" value={lastEpisodeDescription} onChange={(e) => modifyEpisodeDescription(e.target.value)}></textarea>
            </div>
        )
    }

    const changeRepDetails = (changes) => {
        for(let key in changes) {
            rep[key] = changes[key];
        }

        setRep(rep);

        setRepEmail(rep.adres_email);
        setRepPhone(rep.tel_komorkowy);

        updateRep();
    }

    const buildRepForm = () => {
        if(!rep) return '';

        return (
            <div className="margin-bottom-default">
                <div className="form-gorup">
                    <label for="task-phone">Telefon: </label>
                    <input id="task-phone" type="text" className="form-control" onChange={(e) => changeRepDetails({ tel_komorkowy: e.target.value })} value={repPhone}></input>
                </div>
                <div className="form-gorup">
                    <label for="task-email">Email: </label>
                    <input id="task-email" type="text" className="form-control" onChange={(e) => changeRepDetails({ adres_email: e.target.value })} value={repEmail}></input>
                </div>
            </div>
        );
    }

    const updateTask = (taskObject) => {
        for(let taskKey in taskObject) {
            task[taskKey] = taskObject[taskKey];
        }

        setTask(task);

        TaskHandler.patchTask(task.id, task).then((task) => {
        }).catch((err) => {
            console.log(err);
        });
    }

    const buildErrorType = () => {
        let allowedErrorTypes = appConfig.errorTypes.allowed;
        
        let filteredErrorTypes = errorTypes.filter((errorType) => {
            return allowedErrorTypes.includes(errorType.id);
        });

        let errorTypesRadios = filteredErrorTypes.map((errorType) => {
            return (
                <Form.Check inline label={errorType.nazwa} type='radio' onChange={(e) => { updateTask({ id_uslugi: errorType.id, usluga: errorType.nazwa }); setPickedErrorType(errorType.id); } } checked={(pickedErrorType || (task ? task.id_uslugi : 0) ) == errorType.id}></Form.Check>
            );
        });

        return (
            <div>
                <label><strong>Typ błędu:</strong></label>
                <div>
                    {errorTypesRadios}
                </div>
            </div>
        );
    }

    const buildNonLastEpisodes = () => {
        if(!taskEpisodes) return '';

        let nonLastEpisodes = taskEpisodes.filter((taskEpisode, key) => {
            return key != 0;
        });

        let taskEpisodeList = nonLastEpisodes.map((taskEpisode, key) => {
            return (
                <div className="task-episode margin-bottom-default">
                    <Row>
                        <Col xs="4">
                            <div><strong>Etap {(taskEpisodes.length - 1) - key}</strong>:</div>
                        </Col>
                        <Col xs="8" className="text-right">
                            <div className="travel-box no-switch">
                                <div>
                                    <strong>Dojazd:</strong>
                                </div>
                                <div>{taskEpisode.forma_interwencji ? 'Tak' : 'Nie'}</div>
                            </div>
                        </Col>
                    </Row>
                    <div className="margin-top-reduced">Opis etapu:</div>
                    <div className="task-episode-description">{taskEpisode.rozwiazanie}</div>
                </div>
            )
        });

        return taskEpisodeList;
    }

    if (!task) return <Alert response={response}></Alert>;

    if (redirect) {
        return <Redirect to={redirect}></Redirect>;
    }

    return (
        <Page>
            <Alert response={response}></Alert>
            <h1>Zadanie: {task.id}<br />{task.zglaszajacy}</h1>
            {buildErrorType()}
            {buildRepForm()}
            <div className="form-group task-description-container margin-bottom-default">
                <label for="task_description">Opis problemu:</label>
                <div className="task-description-content">
                    <textarea id="task_description" className={'form-control'} value={taskDescription} onChange={(e) => modifyTaskDescription(e.target.value)} disabled={!taskEpisodes || taskEpisodes.length > 1}></textarea>
                </div>
            </div>
            {buildLastEpisode()}
            {buildNonLastEpisodes()}
            <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            <Button onClick={(e) => stopTask()} className="btn-inverted btn-center">
                                Stop
                            </Button>
                        </Col>
                    </Row>
                    <TaskReassign taskId={props.match.params.taskId} updateDescriptions={updateDescriptions}></TaskReassign>
                </div>
            </div>
        </Page>
    );
}

export default Task;