import React, {createContext, useState } from 'react';
import TaskHandler from '../Handlers/TaskHandler';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button } from '../Components/bootstrap';

export const TaskContext = createContext();

const TaskContextProvider = ({children}) => {
  const [ taskStarted, setTaskStarted ] = useState(false);
  const [ tasksVisible, setTasksVisible ] = useState(false);
  const [ takeOverStarted, setTakeOverStarted ] = useState(false);
  const [ viewedOperator, setViewedOperator ] = useState(null);
  const [ viewedTaskList, setViewedTaskList ] = useState([]);
  const [ activeTasksModal, setActiveTasksModal ] = useState({
      title: '',
      description: ''
  });
  const [ taskForTakeOver, setTaskForTakeOver ] = useState(null);
  const [ takeOverModalVisible, setTakeOverModalVisible ] = useState(false);
  const [ takeOverButtonDisabled, setTakeOverButtonDisabled ] = useState({
      status: false
  });
  const [ takeOverModal, setTakeOverModal ] = useState({
      title: '',
      description: '',
      buttons: []
  });
  const [ taskPreviewVisible, setTaskPreviewVisible ] = useState(false);
  const [ previewedTask, setPreviewedTask ] = useState(null);

  const createTask = (selectedRepId, selectedClientId) => {
    setTaskStarted(true);
    return TaskHandler.createTask(selectedClientId, selectedRepId);    
  }

  const changeOperator = (representative) => {
    console.log('test');
    console.log(representative);
    setViewedOperator(representative);
}

  const renderTaskList = () => {
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
  };

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

  const previewTask = (task) => {
    setPreviewedTask(task);
    setTaskPreviewVisible(true);
}

  const takeOverTask = (task) => {
      setTaskForTakeOver(task);
      setTakeOverModalVisible(true);
  }

  return (
    <div>
      <TaskContext.Provider value={{ taskStarted, setTaskStarted, createTask, tasksVisible, setTasksVisible, takeOverStarted, setTakeOverStarted, viewedOperator, setViewedOperator, viewedTaskList, setViewedTaskList, activeTasksModal, setActiveTasksModal, taskForTakeOver, setTaskForTakeOver, takeOverModalVisible, setTakeOverModalVisible, takeOverButtonDisabled, setTakeOverButtonDisabled, takeOverModal, setTakeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, setPreviewedTask, renderTaskList, changeOperator }} >
        {children}
      </TaskContext.Provider>
    </div>
  );
}

export default TaskContextProvider;