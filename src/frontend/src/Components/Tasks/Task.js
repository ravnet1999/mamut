import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from '../bootstrap';
import { Redirect } from 'react-router-dom';
import Page from '../Page';
import Alert from '../Alert/Alert';
import OperatorHandler from '../../Handlers/OperatorHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import ServiceHandler from '../../Handlers/ServiceHandler';
import UserHandler from '../../Handlers/UserHandler';
import TaskReassign from './TaskReassign';
import Modal from '../Modal/Modal';
import './Tasks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBoxOpen, faUserClock, faCalendarDay, faTruck, faBookReader, faWindowClose, faUpload, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import appConfig from '../../Config/appConfig.json';
import DatePicker, { registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';
import 'react-datepicker/dist/react-datepicker.css';
import ReactTooltip from 'react-tooltip';
import FormData from 'form-data';
import moment from 'moment';
import AppendixHandler from '../../Handlers/AppendixHandler';
import axios from 'axios';

registerLocale('pl', pl);

const Task = (props) => {
    const [options, setOptions] = useState(null);
    const [task, setTask] = useState(null);
    const [appendices, setAppendices] = useState(null);
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
    const [awaitClicked, setAwaitClicked] = useState(false);
    const [awaitDate, setAwaitDate] = useState({
        date: null
    });
    const [datePickerEnabled, enableDatePicker] = useState(false);
    const [dateConfirmEnabled, enableDateConfirm] = useState(true);
    const [pickerInput, setPickerInput] = useState(null);
    const [descriptionModified, setDescriptionModified] = useState(false);

    const [selectedAppendices, setSelectedAppendices] = useState(null);
    const [taskAppendicesKey, setTaskAppendicesKey] = useState(null);

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

        UserHandler.update(rep.id, rep).then((result) => {

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
            UserHandler.get(response.resources[0].id_zglaszajacy).then((rep) => {
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

    useEffect(() => {
      if(!task) return;

      AppendixHandler.getByTaskId(task.id).then(result => {
        setAppendices(result.resources);
      });
  }, [task])

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

    // useEffect(() => {
    //     if(!lastEpisode) return;

    //     return () => {
    //         TaskHandler.updateEpisodeTravel(lastEpisode.id, appState.travel ? 1 : 0).then((result) => {

    //         }).catch((err) => {
    //             console.log(err);
    //         });
    //     }
    // }, [travel]);

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

    useEffect(() => {
        if(!task) return () => {

        };
        TaskHandler.updateTaskDescription(task.id, appState.taskDescription).then((result) => {
            setDescriptionModified(false);
        }).catch((err) => {
            console.log(err);
        })
    }, [descriptionModified]);

    useEffect(() => {
        if(!lastEpisode) return () => {

        };
        TaskHandler.updateLastEpisodeDescription(lastEpisode.id, appState.episodeDescription).then((result) => {
            console.log('updated episode description...');
        }).catch((err) => {
            console.log(err);
        })
    }, [appState.episodeDescription])

    useEffect(() => {
        if(!lastEpisode || !appState.travel) return () => {

        }
        TaskHandler.updateEpisodeTravel(lastEpisode.id, appState.travel ? 1 : 0).then((result) => {
            console.log('updated travel...');
        }).catch((err) => {
            console.log(err);
        })
    }, [travel]);

    // useEffect(() => {
    //     if(!lastEpisode || !task || !appState.episodeDescription) return () => {

    //     };
    //     console.log('started description update', '-', 'episodeDescription: ', appState.episodeDescription);
    //     TaskHandler.updateLastEpisodeDescription(lastEpisode.id, appState.episodeDescription).then((result) => {
    //         return TaskHandler.updateTaskDescription(task.id, appState.taskDescription);
    //     }).then((result) => {
    //         setDescriptionModified(false);
    //         return TaskHandler.updateEpisodeTravel(lastEpisode.id, appState.travel ? 1 : 0);
    //         // if(callback) {
    //         //     callback();
    //         // }
    //     }).then((result) => {
    //         console.log('updated description');
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    // }, [descriptionModified, travel, appState.episodeDescription]);

    const stopTask = () => {
        TaskHandler.stopTask(task.id).then((response) => {
            // setResponse(response);
            // updateDescriptions();
            setDescriptionModified(true);
            setRedirect(task.informatyk == 0 ? '/tasks/general' : '/tasks');
        }).catch((err) => {
            setResponse(err);
        });
    }

    const awaitTask = (type, description) => {
        enableDateConfirm(false);
        TaskHandler.awaitTask(task.id, type, description).then((response) => {
            setAwaitClicked(false);
            enableDatePicker(false);
            enableDateConfirm(true);
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        })
    }

    const modifyTaskDescription = (value) => {
        let newState = appState;
        newState.taskDescription = value;
        setAppState(newState);
        setTaskDescription(value);

        props.updateTaskCount();
        if(lastEpisode && task && (taskDescription !== null || lastEpisodeDescription !== null)) {
            // updateDescriptions();
            setDescriptionModified(true);
        }
    }

    const modifyEpisodeDescription = (value) => {
        let newState = appState;
        newState.episodeDescription = value;
        setAppState(newState);
        setLastEpisodeDescription(value);

        props.updateTaskCount();
        if(lastEpisode && task && (taskDescription !== null || lastEpisodeDescription !== null)) {
            // updateDescriptions();
            setDescriptionModified(true);
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
                setDescriptionModified(true);
                if(callback) {
                    callback();
                }
                // updateDescriptions(() => {
                //     TaskHandler.updateEpisodeTravel(lastEpisode.id, appState.travel ? 1 : 0).then((result) => {
                //         if(callback) {
                //             callback();
                //         }
                //     }).catch((err) => {
                //         console.log(err);
                //     });
                // });
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
            setDescriptionModified(true);
        }).catch((err) => {
            console.log(err);
        });
    }

    const buildErrorType = () => {
        let allowedErrorTypes = appConfig.errorTypes.allowed;
        
        let filteredErrorTypes = errorTypes.filter((errorType) => {
            return allowedErrorTypes.includes(errorType.id);
        });

        let renamedErrorTypes = filteredErrorTypes.map((errorType) => {
            return {
                id: errorType.id,
                name: String(errorType.id)
            }
        });

        console.log(renamedErrorTypes);

        let sortOrder = {
            "C": 0,
            "B": 1,
            "A": 2,
            "Z": 3,
            "K": 4,
            "W": 5
        }

        renamedErrorTypes.sort((a, b) => {
            return sortOrder[a.name] - sortOrder[b.name];
        });

        let errorTypesRadios = renamedErrorTypes.map((errorType, key) => {
            return (
                <Form.Check className={key == 2 ? 'errorType-margin-right' : ''} key={key} id={`errorType-radio-${key}`} inline label={String(errorType.id)} type='radio' onChange={(e) => { updateTask({ id_uslugi: errorType.id, usluga: errorType.nazwa }); setPickedErrorType(errorType.id); } } checked={(pickedErrorType || (task ? task.id_uslugi : 0) ) == errorType.id}></Form.Check>
            );
        });

        return (
            <div className="errorTypeRadios text-right">
                <span><strong>Błąd typu:</strong></span> {errorTypesRadios}
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

    if(awaitDate.date) {
        console.log(awaitDate.date.getDate(), awaitDate.date.getMonth() + 1, awaitDate.date.getFullYear());
    }

    const formatDate = (date) => {
        if (!date) return '';
        let mDate = moment(date);
        return mDate.format('YYYY-MM-DD HH.mm.ss');
        // return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' - ' + date.toLocaleTimeString();
    }

    const pickDate = () => {
        enableDatePicker(true);
        console.log(pickerInput);
        if(pickerInput) pickerInput.setOpen(true);
    }

    const onAppendicesChange = event => {
      setSelectedAppendices(event.target.files);       
    };

    const onAppendicesUpload = event => {
      const formData = new FormData();

      for (let i = 0; i < selectedAppendices.length; i++) {
        formData.append(`task-appendices[${i}]`, selectedAppendices[i])
      }

      TaskHandler.addAppendices(task.id, formData).then((result) => {
        setTaskAppendicesKey(Math.random().toString(36)); 
        setAppendices([result.resources[0], ...appendices])
      }).catch((err) => {
        console.log(err);
      });
    };

    const onAppendixDownload = async (appendixId) => {
      let appendixInfoUrl = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendixId}/json`;
      let result = await axios.get(`${appendixInfoUrl}`, {
        withCredentials: true
      });

      let appendix = result.data.resources;
      let buffer = new Uint8Array(appendix.data.data);
      let appendixDownloadUrl = window.URL.createObjectURL(new Blob([buffer], {"type": appendix.typ_mime}));
      let a = document.createElement('a');
      a.href = appendixDownloadUrl;
      a.download = appendix.nazwa_oryginalna;
      document.body.append(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(appendixDownloadUrl);
    }

    // const onAppendixDownload = async (appendix) => {
    //   let appendixDownloadUrl = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;

    //   let a = document.createElement('a');
    //   a.href = appendixDownloadUrl;
    //   a.download = appendix.nazwa_oryginalna;  
    //   document.body.append(a);
    //   a.click();
    //   a.remove();
    //   window.URL.revokeObjectURL(appendixDownloadUrl);
    // }

    const buildAppendicesDownloadButtons = () => {
      return appendices.map((appendix, key) => {
        // let url = `${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendix.id}/file`;
        // return <a href={url} target="_blank" download={appendix.nazwa_oryginalna}>{appendix.nazwa_oryginalna}</a>;
        return <Row className="margin-top-default">
            <Col>
              {appendix.nazwa_oryginalna}
              <Button className="appendix-download-button" onClick={e=>{onAppendixDownload(appendix.id)}}>
                <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
              </Button>
              <Button className="appendix-remove-button" onClick={e=>{onAppendixRemove(appendix)}}>
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
              </Button>
            </Col>
          </Row>
      });    
    } 

    const onAppendixRemove = () => {

    }

    console.log(lastEpisode);

    return (
        <Page>
            <Alert response={response}></Alert>
            <h1>Zadanie: {task.id}<br />{task.zglaszajacy}<br />Klient: {task.klient}</h1>
            {buildRepForm()}
            <div className="form-group task-description-container margin-bottom-default">
                <label for="task_description">Opis problemu:</label>
                <div className="task-description-content">
                    <textarea id="task_description" className={'form-control'} value={taskDescription} onChange={(e) => modifyTaskDescription(e.target.value)} disabled={!taskEpisodes || taskEpisodes.length > 1}></textarea>
                </div>
                {buildErrorType()}
            </div>

            <div className="form-group task-appendices-container margin-bottom-default">
            <Row>
              <Col>
                <label for="task-appendices">Załączniki:</label><br/>
                <div className="task-appendices-content">
                  <input id="task-appendices" name="task-appendices" key={taskAppendicesKey||''} multiple className={'form-control', 'margin-top-reduced',  'margin-bottom-default'} type="file" onChange={onAppendicesChange} />  
                  <Button className="appendices-add-button" onClick={onAppendicesUpload}><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></Button>
                </div>
                { appendices &&  buildAppendicesDownloadButtons()}
              </Col>
            </Row>  
            </div>             

            {buildLastEpisode()}
            {buildNonLastEpisodes()}
            <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <div className={`floating-datepicker ${datePickerEnabled ? 'd-block' : 'd-none'}`}>
                        <Row>
                            <Col xs="6" md="8" className="datepicker-column">
                                <DatePicker
                                    locale='pl'
                                    className="form-control"
                                    selected={awaitDate.date}
                                    onChange={(date) => setAwaitDate({ date: date })}
                                    dateFormat='dd/MM/yyyy HH:mm'
                                    timeFormat='HH:mm'
                                    placeholderText='Wybierz datę...'
                                    showTimeSelect
                                    timeIntervals={15}
                                    ref={(picker) => setPickerInput(picker)}
                                >
                                </DatePicker>
                            </Col>
                            <Col xs="3" md="2">
                                <Button onClick={(e) => awaitTask(`OCZEKUJE`, `Termin ${formatDate(awaitDate.date)}`)} disabled={!dateConfirmEnabled || !awaitDate.date}>Potwierdź</Button>
                            </Col>
                            <Col xs="3" md="2">
                                <Button onClick={(e) => enableDatePicker(false)}>Anuluj</Button>
                            </Col>
                        </Row>
                    </div>
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            <div className={`floating-buttons ${awaitClicked ? 'd-block' : 'd-none'}`}>
                                <Button data-tip="Zasoby" onClick={(e) => awaitTask('OCZEKUJE', 'Zasoby')}><FontAwesomeIcon icon={faBoxOpen}></FontAwesomeIcon></Button>
                                <Button data-tip="Kompetencje" onClick={(e) => awaitTask('OCZEKUJE', 'Kompetencje')}><FontAwesomeIcon icon={faBookReader}></FontAwesomeIcon></Button>
                                <Button data-tip="Użytkownik" onClick={(e) => awaitTask('OCZEKUJE', 'Uzytkownik')}><FontAwesomeIcon icon={faUserClock}></FontAwesomeIcon></Button>
                                <Button data-tip="Termin" onClick={(e) => pickDate()}><FontAwesomeIcon icon={faCalendarDay}></FontAwesomeIcon></Button>
                                <Button data-tip="Transport" onClick={(e) => awaitTask('OCZEKUJE', 'Transport')}><FontAwesomeIcon icon={faTruck}></FontAwesomeIcon></Button>
                                <Button data-tip="Zamknij" onClick={(e) =>  setAwaitClicked(false)} className={'btn-close-menu'}><FontAwesomeIcon icon={faWindowClose}></FontAwesomeIcon></Button>
                                <ReactTooltip />
                            </div>
                            <Button onClick={(e) => awaitClicked ? awaitTask('OCZEKUJE', 'STOP') : setAwaitClicked(true)} className="btn-inverted btn-center btn-await">
                                { awaitClicked ? 'STOP' : 'Oczekuje'}
                            </Button>
                            {/* <Button onClick={(e) => stopTask()} className="btn-inverted btn-center">
                                Stop
                            </Button> */}
                        </Col>
                    </Row>
                    <TaskReassign taskId={props.match.params.taskId} updateDescriptions={updateDescriptions}></TaskReassign>
                </div>
            </div>
        </Page>
    );
}

export default Task;