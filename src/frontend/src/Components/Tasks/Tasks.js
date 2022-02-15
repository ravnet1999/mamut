import React from 'react';
import { Row, Col, Button } from '../bootstrap';
import './Tasks.css';
import Page from '../Page';
import Alert from '../Alert/Alert';
import TaskReassign from './TaskReassign';
import Modal from '../Modal/Modal';
import TaskPreview from './TaskPreview';
import { WithContexts } from '../../HOCs/WithContexts';
import { TasksContext } from '../../Contexts/TasksContext';
import useTasksEffects from '../../Hooks/useTasksEffects';

const Tasks = (props) => {
    const { 
      response, setResponse, tasks, setTasks, pickedTask, setPickedTask, closeDisabledId, setCloseDisabledId, taskStarted, setTaskStarted, modal, setModal, modalVisible, setModalVisible, previewedTask, setPreviewedTask, taskPreviewVisible, setTaskPreviewVisible, getTasks, startTask, closeTask, parseStampDescription, previewTask, closeTaskPreview, buildTaskRadios 
    } = props;

    useTasksEffects(props);

    return (
        <Page>
            { taskPreviewVisible ? <TaskPreview task={previewedTask} onClose={closeTaskPreview}></TaskPreview> : '' }
            <Modal title={modal.title} description={modal.description} buttons={modal.buttons} visible={modalVisible} onClose={() => setModalVisible(false)}></Modal>
            <Alert response={response}></Alert>
            {buildTaskRadios(props)}
            {/* <Row className="margin-top-default margin-bottom-default">
                <Col className="text-center">
                    <Button className="large" onClick={(e) => startTask()}>Start</Button>    
                </Col>
            </Row> */}
            <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            <Button onClick={(e) => startTask()} className="btn-inverted btn-center btn-center" disabled={(tasks ? tasks.length == 0 : true) || taskStarted || taskPreviewVisible}>Start</Button>    
                        </Col>
                    </Row>
                    { pickedTask && tasks.length > 0 ? <TaskReassign taskId={pickedTask.id} reassignFinished={getTasks} redirect='/admin/tasks/general'></TaskReassign> : ''}
                </div>
            </div>
        </Page>
    );
}

export default WithContexts(Tasks, [ TasksContext ]);