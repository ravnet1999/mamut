import React, { useState, useEffect } from 'react';
import Page from '../Page';
import { Row, Col, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import ClientHandler from '../../Handlers/ClientHandler';
import UserHandler from '../../Handlers/UserHandler';
import Modal from '../Modal/Modal';
import TaskPreview from '../Tasks/TaskPreview';
import './Representatives.css';

import { TaskContext } from '../../Contexts/TaskContext';
import { WithContexts } from '../../HOCs/WithContexts'
import useTaskEffects from '../../Hooks/useTaskEffects';

import RepresentativesList from './RepresentativesList';

import ClientDocumentation from '../Clients/ClientDocumentation';

const Representatives = (props) => {
    useTaskEffects(props);

    const [representatives, setRepresentatives] = useState([]);
    const [selectedRep, setSelectedRep] = useState(null);
    const [response, setResponse] = useState(null);
    const [startButtonVisible, setStartButtonVisible] = useState(true);

    const { taskStarted, createTask, tasksVisible, setTasksVisible, activeTasksModal, takeOverModalVisible, setTakeOverModalVisible, takeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, changeOperator } = props;
  
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

    const pickedClient = props.match.params.clientId;
    
    const afterRepCreationButtonClicked = () => setStartButtonVisible(false);
    const afterRepCreationFormModalClosed = () => setStartButtonVisible(true);
    const afterRepCreated = async (repId) => {
      let response = await UserHandler.getWithTasks(repId);
      const representative = response.resources[0];     
      setSelectedRep(representative);
      
      representatives.push(representative);
      response = ClientHandler.sortRepresentatives(representatives);
      setRepresentatives(response.resources);
      
      setStartButtonVisible(true);   
    }

    const selectRepButtonOnClick = (representative) => {
      setSelectedRep(representative);
      setStartButtonVisible(true);
    }
  
    const clientColumns = () => {
      return representatives.map((representative, index) => 
          <Col xs="12" sm="12" md="6" lg="4" key={index}>
            <Button onClick={(e) => selectRepButtonOnClick(representative)} className={ `full-width margin-bottom-default ${ selectedRep && selectedRep.id === representative.id ? 'active' : ''}` }>
                {representative.imie} {representative.nazwisko}
                <span className="task-count" onClick={() => changeOperator(representative)}>
                    {representative.activeTasks.length > 0 ? `(${representative.activeTasks.length})` : ''}
                </span>
            </Button>
          </Col>
      );
    };

    return (
        <Page>
            { taskPreviewVisible ? <TaskPreview task={previewedTask} onClose={() => setTaskPreviewVisible(false)}></TaskPreview> : '' }
            <Modal className="takeover-modal" buttons={takeOverModal.buttons} closeButtonName={'Zamknij'} title={takeOverModal.title} description={takeOverModal.description} visible={takeOverModalVisible} onClose={() => setTakeOverModalVisible(false)}></Modal>
            <Modal buttons={[]} closeButtonName={'Zamknij'} title={activeTasksModal.title} description={activeTasksModal.description} visible={tasksVisible} onClose={() => setTasksVisible(false)}></Modal>
            <Alert response={response}></Alert>
            <RepresentativesList pickedClient={pickedClient} afterRepCreationButtonClicked={ afterRepCreationButtonClicked } afterRepCreationFormModalClosed={  afterRepCreationFormModalClosed } afterRepCreated={ afterRepCreated } selectRepButtonOnClick={ selectRepButtonOnClick } clientColumns={ clientColumns }></RepresentativesList>
            <ClientDocumentation clientId={pickedClient}/>
            { startButtonVisible && 
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
            }
        </Page>
    );
}

export default WithContexts(Representatives, [ TaskContext ]);