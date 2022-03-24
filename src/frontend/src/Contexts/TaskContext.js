import React, {createContext, useState } from 'react';
import TaskHandler from '../Handlers/TaskHandler';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Components/bootstrap';

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

  const showTasks = () => {
    setActiveTasksModal({
      title: `Aktywne zadania dla ${viewedOperator.imie} ${viewedOperator.nazwisko}`,
      description: viewedTaskList
    });
    setTasksVisible(true);
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
                            <div className="hover-cursor hover-underline" onClick={(e) => previewTask(task)}><strong>ID:</strong> {task.id}</div><div><strong>Opis:</strong> {task.opis ? task.opis.substr(0, 150) + (task.opis.length > 150 ? '...' : '') : 'Brak opisu'}</div><div><strong>Ostatni etap:</strong> {task.lastEpisode && task.lastEpisode.rozwiazanie ? task.lastEpisode.rozwiazanie.substr(0, 150) + (task.lastEpisode.rozwiazanie.length > 150 ? '...' : '') : 'Brak opisu etapu.'} </div>
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

  const showTakeOverModal = () => {
    console.log('refreshing modal');

    setTakeOverModal({
        title: `Przejęcie zadania ${taskForTakeOver.id} - ${taskForTakeOver.zglaszajacy}`,
        description: `Czy na pewno chcesz przejąć zadanie ${taskForTakeOver.id} - ${taskForTakeOver.zglaszajacy} klienta ${taskForTakeOver.klient}?`,
        buttons: [
            {
                name: 'Potwierdź',
                method: () => {
                    setTakeOverStarted(true);
                    TaskHandler.reassignTask(taskForTakeOver.id, undefined, true).then((result) => {
                        setTakeOverStarted(false);
                        setTakeOverModalVisible(false);
                        window.location.replace(`/admin/task/${taskForTakeOver.id}`);
                    }).catch((err) => {
                        console.log(err);
                        setTakeOverStarted(false);
                        setTakeOverModalVisible(false);
                    });
                },
                disabled: {
                    status: takeOverStarted
                }
            }
        ]
    })
  }

  return (
    <div>
      <TaskContext.Provider value={{ taskStarted, createTask, tasksVisible, setTasksVisible, takeOverStarted, viewedOperator, viewedTaskList, activeTasksModal, taskForTakeOver, takeOverModalVisible, setTakeOverModalVisible, takeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, renderTaskList, changeOperator, showTasks, showTakeOverModal }} >
        {children}
      </TaskContext.Provider>
    </div>
  );
}

export default TaskContextProvider;