import React, {createContext, useState } from 'react';
import TaskHandler from '../Handlers/TaskHandler';

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

  return (
    <div>
      <TaskContext.Provider value={{ taskStarted, setTaskStarted, createTask, tasksVisible, setTasksVisible, takeOverStarted, setTakeOverStarted, viewedOperator, setViewedOperator, viewedTaskList, setViewedTaskList, activeTasksModal, setActiveTasksModal, taskForTakeOver, setTaskForTakeOver, takeOverModalVisible, setTakeOverModalVisible, takeOverButtonDisabled, setTakeOverButtonDisabled, takeOverModal, setTakeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, setPreviewedTask, sortTasks }} >
        {children}
      </TaskContext.Provider>
    </div>
  );
}

export default TaskContextProvider;