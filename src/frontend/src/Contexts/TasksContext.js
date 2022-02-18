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
        setTasks(tasks);

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
  // let header = tasks.length === 0 ? <></> :
  //   <Row key={0} >
  //     <Col xs="6">
  //       <div className="text-light text-center bg-dark">Zadania typu "Z" / "W"</div>
  //     </Col> 
  //     <Col xs="6">
  //       <div className="text-light text-center bg-dark">Zadania pozostałych typów</div>
  //     </Col>
  //   </Row>  
    
  // let rows = _.times(Math.max(tasksLeftCol.length, tasksRightCol.length), (key) => (
  //   <Row key={key}>
  //     <Col xs="6">
  //       { tasksLeftCol[key] &&
  //         <TaskItem {...props} key={2*key+1} task={tasksLeftCol[key]}></TaskItem>
  //       }
  //       { key==0 && !tasksLeftCol[key] && <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div> }
  //     </Col>
  //     <Col xs="6">
  //       { tasksRightCol[key] &&
  //         <TaskItem {...props} key={2*key+2} task={tasksRightCol[key]}></TaskItem>
  //       }
  //       { key==0 && !tasksRightCol[key] && <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div> }
  //     </Col>
  //   </Row>  
  // ));

  // return <>
  //   { header } 
  //   { rows }
  // </>


  let rowsLeft = _.times(tasksLeftCol.length, (key) => (
      <Row key={key}>
        <Col xs="12">
          { tasksLeftCol[key] &&
            <TaskItem {...props} key={2*key+1} task={tasksLeftCol[key]}></TaskItem>
          }
          { key==0 && !tasksLeftCol[key] && <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div> }
        </Col>
      </Row>  
    ));
  let rowsRight = _.times(tasksRightCol.length, (key) => (
      <Row key={key}>
        <Col xs="12">
          { tasksLeftCol[key] &&
            <TaskItem {...props} key={2*key+1} task={tasksRightCol[key]}></TaskItem>
          }
          { key==0 && !tasksRightCol[key] && <div className="alert alert-success text-center">Dobra robota. Brak zadań!</div> }
        </Col>
      </Row>  
    ));


  return <>
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