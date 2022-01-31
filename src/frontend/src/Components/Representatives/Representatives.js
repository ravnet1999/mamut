import React, { useState, useEffect } from 'react';
import Page from '../Page';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';
import Modal from '../Modal/Modal';
import TaskPreview from '../Tasks/TaskPreview';
import './Representatives.css';

import { TaskContext } from '../../Contexts/TaskContext';
import { WithContexts } from '../../HOCs/WithContexts'

const Representatives = (props) => {
    const [representatives, setRepresentatives] = useState([]);
    const [selectedRep, setSelectedRep] = useState(null);
    const [response, setResponse] = useState(null);
    
    const { taskStarted, createTask, tasksVisible, setTasksVisible, takeOverStarted, viewedOperator, viewedTaskList, activeTasksModal, taskForTakeOver, takeOverModalVisible, setTakeOverModalVisible, takeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, renderTaskList, changeOperator, showTasks, showTakeOverModal } = props;
  
    const createTaskAndRenderResponse = (event) => {
      setResponse({
          error: false,
          messages: ['Tworzenie zadania...']
      });

      createTask(selectedRep.id, props.match.params.clientId)
      .then(result => setResponse(result))
      .catch(err => setResponse(err));
    }
  
    useEffect(() => {
        props.setCurrentPage(props.history.location.pathname);
        ClientHandler.getSortedRepresentatives(props.match.params.clientId).then((response) => {
            let sorted = response.resources;
            setRepresentatives(sorted);
            response.messages = ['Wybierz reprezentanta:']
            setResponse(response);
        }).catch((err) => {
            setResponse(err);
        });

        return props.updateTaskCount;
    }, []);

    useEffect(() => {
        if(!viewedOperator) return () => {

        };

        renderTaskList();
    }, [viewedOperator, takeOverStarted])

    useEffect(() => {
        if(!viewedOperator) return () => {

        };

        showTasks();
    }, [viewedTaskList]);

    useEffect(() => {
        if(!takeOverModalVisible || !taskForTakeOver) return () => {

        };

        showTakeOverModal();

    }, [takeOverModalVisible, taskForTakeOver, takeOverStarted]);    

    const buildClients = () => {
        
        let clientColumns = representatives.map((representative, index) => {
        return <Col xs="12" sm="12" md="6" lg="4" key={index}>
                <Button onClick={(e) => setSelectedRep(representative)} className={ `full-width margin-bottom-default ${ selectedRep && selectedRep.id === representative.id ? 'active' : ''}` }>
                    {representative.imie} {representative.nazwisko}
                    <span className="task-count" onClick={() => changeOperator(representative)}>
                        {representative.activeTasks.length > 0 ? `(${representative.activeTasks.length})` : ''}
                    </span>
                </Button>
            </Col>;
        });

        return (
            <Row>
                {clientColumns}
            </Row>
        );
    }

    return (
        <Page>
            { taskPreviewVisible ? <TaskPreview task={previewedTask} onClose={() => setTaskPreviewVisible(false)}></TaskPreview> : '' }
            <Modal className="takeover-modal" buttons={takeOverModal.buttons} closeButtonName={'Zamknij'} title={takeOverModal.title} description={takeOverModal.description} visible={takeOverModalVisible} onClose={() => setTakeOverModalVisible(false)}></Modal>
            <Modal buttons={[]} closeButtonName={'Zamknij'} title={activeTasksModal.title} description={activeTasksModal.description} visible={tasksVisible} onClose={() => setTasksVisible(false)}></Modal>
            <Alert response={response}></Alert>
            { buildClients() }
            <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            {/* <Alert response={response}></Alert> */}
                            <Button onClick={(e) => createTaskAndRenderResponse()} className="btn-inverted btn-start btn-center" disabled={!selectedRep || taskStarted}>Start</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Page>
    );
}

export default WithContexts(Representatives, [ TaskContext ]);