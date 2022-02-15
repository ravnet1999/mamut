import React, {createContext, useState } from 'react';
import TaskHandler from '../Handlers/TaskHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Row, Col, Button, Form } from '../Components/bootstrap';

export const TasksContext = createContext();

const TasksContextProvider = ({children}) => {
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
  const [previewedTask, setPreviewedTask] = useState(null);
  const [taskPreviewVisible, setTaskPreviewVisible] = useState(false);

  const getTasks = (general) => {    
    TaskHandler.getTasks( general ? true : false).then((response) => {
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

  const closeTask = (taskId) => {
    setCloseDisabledId(taskId);
    TaskHandler.closeTask(taskId).then((response) => {
        setResponse(response);
        getTasks();
    });
}

const parseStampDescription = (stampDescription) => {
    if(!stampDescription) return '';

    return stampDescription.substr(0, 6) == 'Termin' ? 'Termin' : stampDescription;
}

const previewTask = (task) => {
    setPreviewedTask(task);
    setTaskPreviewVisible(true);
}

const closeTaskPreview = () => {
    setTaskPreviewVisible(false);
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
                        <Button onClick={(e) => previewTask(task)} className="small circular info">i</Button>
                        <Form.Check
                            type="radio"
                            label={`${task.id} - ${task.zglaszajacy}`}
                            id={`task_${task.id}`}
                            onChange={(e) => setPickedTask(task)}
                            checked={isChecked}
                            className={`d-inline-block vertical-middle-static ${isChecked ? 'picked' : ''}`}
                        >
                        </Form.Check>
                        <span className={`task-description description ${taskStampClass} vertical-middle-static d-inline-block`}> - {task.lastStamp?.nazwa} {task.lastStamp && task.lastStamp.nazwa == 'OCZEKUJE' ? `: ${parseStampDescription(task.lastStamp?.opis)}` : ''}</span><br />
                        { task.klient ? <div className="task-main-description">Klient: {task.klient}</div> : '' }
                        { task.klient ? <br /> : '' }
                        { task.terminowe == 1 && task.termin ? ( <div className="task-main-description">Termin: {moment(task.termin).utcOffset(0).format('DD-MM-YYYY HH:mm:ss')}</div> ) : '' }
                        { task.terminowe == 1 && task.termin ? <br /> : ''}
                        {task.opis ? <div className="task-main-description">Opis: {task.opis.substring(0, 50)}{task.opis.length > 50 ? '...' : ''}</div> : '' }
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
    <div>
      <TasksContext.Provider value={{ setResponse, previewedTask, closeTaskPreview, modal, modalVisible, setModalVisible, response, buildTaskRadios, startTask, tasks, taskStarted, taskPreviewVisible, pickedTask, getTasks  }} >
        {children}
      </TasksContext.Provider>
    </div>
  );
}

export default TasksContextProvider;