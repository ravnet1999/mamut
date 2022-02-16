import React, {createContext, useState } from 'react';
import TaskHandler from '../Handlers/TaskHandler';
import { Row, Col } from '../Components/bootstrap';
import TaskItem from '../Components/Tasks/TaskItem';
import appConfig from '../Config/appConfig.json';
import _ from "lodash";

export const TasksContext = createContext();

const TasksContextProvider = ({children}) => {
  const [response, setResponse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLeftCol, setTasksLeftCol] = useState([]);
  const [tasksRightCol, setTasksRightCol] = useState([]);
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
        let tasks = response.resources;

        if(general) {
          let errorTypesLeftCol = [93, 36];

          let tasksLeftCol = tasks.filter(task => errorTypesLeftCol.includes(task.id_uslugi));
          let tasksRightCol = tasks.filter(task => !tasksLeftCol.includes(task));

          setTasksLeftCol(tasksLeftCol);
          setTasksRightCol(tasksRightCol);

          if(tasksLeftCol.length > 0) {
            setPickedTask(tasksLeftCol[0]);
          } else if(tasksRightCol.length > 0) {
            setPickedTask(tasksRightCol[0]);
          }
        } else {          
          setTasks(tasks);

          if(tasks.length > 0) {
            setPickedTask(tasks[0]);
          }
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
  if(props.match.params.general) {
    return buildTaskGeneralRadios(props);
  }

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

const buildTaskGeneralRadios = (props) => { 
  let header = 
    <Row key={0} className="margin-top-default margin-bottom-default">
      <Col xs="6" className="text-center">
        Zadania typu "Z" / "W"
      </Col> 
      <Col xs="6" className="text-center">
        Zadania pozostałych typów
      </Col>
    </Row>  
    
  let rows = _.times(Math.max(tasksLeftCol.length, tasksRightCol.length), (key) => (
    <Row key={key}>
      <Col xs="6">
        { tasksLeftCol[key] &&
          <TaskItem {...props} key={2*key+1} task={tasksLeftCol[key]}></TaskItem>
        }
      </Col>
      <Col xs="6">
        { tasksRightCol[key] &&
          <TaskItem {...props} key={2*key+2} task={tasksRightCol[key]}></TaskItem>
        }
      </Col>
    </Row>  
  ));

  return <>
    { header } 
    { rows }
  </>
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