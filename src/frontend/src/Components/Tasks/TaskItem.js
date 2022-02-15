import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Button, Form } from '../bootstrap';

const TaskItem = (props) => {
  const { 
    task, response, setResponse, tasks, setTasks, pickedTask, setPickedTask, closeDisabledId, setCloseDisabledId, taskStarted, setTaskStarted, modal, setModal, modalVisible, setModalVisible, previewedTask, setPreviewedTask, taskPreviewVisible, setTaskPreviewVisible, getTasks, startTask, closeTask, parseStampDescription, previewTask, closeTaskPreview, buildTaskRadios 
  } = props;

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
    );
}

export default TaskItem;