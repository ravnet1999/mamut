import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from '../bootstrap';
import { Redirect } from 'react-router-dom';
import Page from '../Page';
import Alert from '../Alert/Alert';
import OperatorHandler from '../../Handlers/OperatorHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import TaskReassign from './TaskReassign';
import './Tasks.css';

const Task = (props) => {

    const [task, setTask] = useState(null);
    const [response, setResponse] = useState(null);
    const [taskDescription, setTaskDescription] = useState(null);
    const [taskEpisodes, setTaskEpisodes] = useState(null);
    const [lastEpisode, setLastEpisode] = useState(null);
    const [lastEpisodeDescription, setLastEpisodeDescription] = useState('');
    const [appState, setAppState] = useState({
        taskDescription: '',
        episodeDescription: ''
    })
    const [redirect, setRedirect] = useState(null);

    const updateDescriptions = () => {
        TaskHandler.updateLastEpisodeDescription(lastEpisode.id, appState.episodeDescription).then((result) => {
            TaskHandler.updateTaskDescription(task.id, appState.taskDescription).then((result) => {
                
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        })
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
            setResponse(response);
            setTask(response.resources[0]);
            modifyTaskDescription(response.resources[0].opis)
            TaskHandler.getEpisodes(props.match.params.taskId).then((episodes) => {
                setResponse(episodes);
                setTaskEpisodes(episodes.resources);
                setLastEpisode(episodes.resources[0]);
                modifyEpisodeDescription(episodes.resources[0].rozwiazanie);
            }).catch((err) => {
                setResponse(err);
            })
        }).catch((err) => {
            setResponse(err);
        });
    }, []);

    useEffect(() => {
        return () => {
            props.updateTaskCount();
            if(lastEpisode && task && (taskDescription !== null || lastEpisodeDescription !== null)) {
                updateDescriptions();
            }
        };
    }, [lastEpisode, task]);

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
    }

    const modifyEpisodeDescription = (value) => {
        let newState = appState;
        newState.episodeDescription = value;
        setAppState(newState);
        setLastEpisodeDescription(value);
    }

    const buildLastEpisode = () => {;
        if(!lastEpisode) return '';

        return (
            <div className="form-group task-episode margin-bottom-default">
                <div><strong>Bieżący etap</strong>:</div>
                <div>Opis:</div>
                <textarea className="form-control" value={lastEpisodeDescription} onChange={(e) => modifyEpisodeDescription(e.target.value)}></textarea>
            </div>
        )
    }

    const buildNonLastEpisodes = () => {
        if(!taskEpisodes) return '';

        let nonLastEpisodes = taskEpisodes.filter((taskEpisode, key) => {
            return key != 0;
        });

        let taskEpisodeList = nonLastEpisodes.map((taskEpisode, key) => {
            return (
                <div className="task-episode margin-bottom-default">
                    <div><strong>Etap {(taskEpisodes.length - 1) - key}</strong>:</div>
                    <div>Opis etapu:</div>
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
                    <TaskReassign taskId={props.match.params.taskId}></TaskReassign>
                </div>
            </div>
        </Page>
    );
}

export default Task;