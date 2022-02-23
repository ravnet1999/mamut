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
  const [tasksTopRow, setTasksTopRow] = useState([]);
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
        setTasks(tasks);

        let errorTypesTopRow = [89];
        let errorTypesLeftCol = [93, 36];
        
        let tasksTopRow = tasks.filter(task => errorTypesTopRow.includes(task.id_uslugi));
        let tasksLeftCol = tasks.filter(task => errorTypesLeftCol.includes(task.id_uslugi));
        let tasksRightCol = tasks.filter(task => !tasksTopRow.includes(task) && !tasksLeftCol.includes(task));

        setTasksTopRow(tasksTopRow);
        setTasksLeftCol(tasksLeftCol);
        setTasksRightCol(tasksRightCol);

        if(tasksTopRow.length > 0) {
          setPickedTask(tasksTopRow[0]);
        } else 
        if(tasksLeftCol.length > 0) {
          setPickedTask(tasksLeftCol[0]);
        } else if(tasksRightCol.length > 0) {
          setPickedTask(tasksRightCol[0]);
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
  let headerTop = 
    <Row>
      <Col xs="12">
        <div className="text-light text-center bg-dark">Zadania typu "A"</div>
      </Col>
    </Row>

  let rowsTopLeft = _.times(Math.ceil(tasksTopRow.length/ 2), (key) => (
    <Row xs="12" key={key}>
      <Col xs="12">
        { tasksTopRow[2*key] &&
          <TaskItem {...props} key={2*key} task={tasksTopRow[2*key]}></TaskItem>
        }     
      </Col>   
    </Row>
  ));

  let rowsTopRight = _.times(Math.ceil(tasksTopRow.length/ 2), (key) => (
    <Row xs="12" key={key}>
      <Col xs="12">
        { tasksTopRow[2*key+1] &&
          <TaskItem {...props} key={2*key+1} task={tasksTopRow[2*key+1]}></TaskItem>
        }    
      </Col>    
    </Row>
  ));  

  let rowsTop = tasksTopRow.length === 0 ? 
    <Row>
      <Col xs="12">
        <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div>
      </Col>
    </Row> :
    <Row>
      <Col xs="6">
        { rowsTopLeft }
      </Col>
      <Col xs="6">
        { rowsTopRight }      
      </Col>      
    </Row>;

  let headerBottom = 
    <Row>
      <Col xs="6">
        <div className="text-light text-center bg-dark">Zadania typu "Z" i "W"</div>
      </Col> 
      <Col xs="6">
        <div className="text-light text-center bg-dark">Zadania typu "C", "B" i "K"</div>
      </Col>
    </Row>  

  let rowsLeft = tasksLeftCol.length === 0 ? 
    <Row>
      <Col xs="12">
        <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div>
      </Col>
    </Row> :
    _.times(tasksLeftCol.length, (key) => (
      <Row key={key}>
        <Col xs="12">
          { tasksLeftCol[key] &&
            <TaskItem {...props} key={2*key+1} task={tasksLeftCol[key]}></TaskItem>
          }
          </Col>
      </Row>  
    ));

  let rowsRight = tasksRightCol.length === 0 ? 
    <Row>
      <Col xs="12">
        <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div>
      </Col>
    </Row> :
    _.times(tasksRightCol.length, (key) => (
      <Row key={key}>
        <Col xs="12">
          { tasksRightCol[key] &&
            <TaskItem {...props} key={2*key+1} task={tasksRightCol[key]}></TaskItem>
          }
          { key==0 && !tasksRightCol[key] && <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div> }
        </Col>
      </Row>  
    ));

  return <>
    { headerTop }
    { rowsTop }
    { headerBottom }
    <Row>
      <Col xs="6">
      { rowsLeft }
      </Col>
      <Col xs="6">
      { rowsRight}
      </Col>
    </Row>
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