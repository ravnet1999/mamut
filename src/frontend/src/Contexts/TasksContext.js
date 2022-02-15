import React, {createContext, useState } from 'react';
import TaskHandler from '../Handlers/TaskHandler';
import { Row, Col } from '../Components/bootstrap';
import TaskItem from '../Components/Tasks/TaskItem';

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

const buildTaskRadios = (props) => {
    return tasks.map((task, key) => {
      return (
        <Row key={key}>
            <Col xs="12">
                <TaskItem {...props} key={key} task={task}></TaskItem>
            </Col>
        </Row>        
        );
    });
}

return (
    <div>
      <TasksContext.Provider value={{ response, setResponse, tasks, setTasks, pickedTask, setPickedTask, closeDisabledId, setCloseDisabledId, taskStarted, setTaskStarted, modal, setModal, modalVisible, setModalVisible, previewedTask, setPreviewedTask, taskPreviewVisible, setTaskPreviewVisible, getTasks, startTask, closeTask, parseStampDescription, previewTask, closeTaskPreview, buildTaskRadios }} >
        {children}
      </TasksContext.Provider>
    </div>
  );
}

export default TasksContextProvider;