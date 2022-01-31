import React from 'react';
import './RepresentativesSearch.css';
import Alert from '../Alert/Alert';
import Autosuggest from 'react-autosuggest';
import { Row, Col, Button } from '../bootstrap';
import { RepresentativeSearchContext } from '../../Contexts/RepresentativeSearchContext';
import { TaskContext } from '../../Contexts/TaskContext';
import { WithContexts } from '../../HOCs/WithContexts';
import Modal from '../Modal/Modal';
import TaskPreview from '../Tasks/TaskPreview';
import useTaskEffects from '../../Hooks/useTaskEffects';

const RepresentativesSearch = (props) => {
  useTaskEffects(props);

  const { 
    dispatch, 
    response, setResponse, setSuccessResponse, setErrorResponse, 
    suggestions, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected, getSuggestionValue, renderSuggestion, inputProps,
    selectedRepId, selectedRep, selectedClientId, 
    createTask, taskStarted, tasksVisible, setTasksVisible, activeTasksModal, takeOverModalVisible, setTakeOverModalVisible, takeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, changeOperator   
  } = props;

  const createTaskAndRenderResponse = (event) => {
    dispatch(setSuccessResponse('Tworzenie zadania...'));
    createTask(selectedRepId, selectedClientId)
    .then(result => dispatch(setResponse(result)))
    .catch(err => dispatch(setErrorResponse(err)));
  }

  // Finally, render it!
  return (
    <div className="representatives-search-box">
      <Alert response={response}></Alert>
      
      <div className="react-autosuggest__box">
        <div className="react-autosuggest__column">Znajdź użytkownika<br/>po numerze telefonu:</div>
        <div className="react-autosuggest__column">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
      </div>

      { selectedRep  && <div className="react-autosuggest__box">
        <div className="react-autosuggest__column">Aktywne zadania:</div>
        <div className="react-autosuggest__column">
          <span className="task-count" onClick={() => changeOperator(selectedRep)}>
            ({selectedRep.activeTasks.length})
          </span> 
        </div>
      </div> }

      { taskPreviewVisible ? <TaskPreview task={previewedTask} onClose={() => setTaskPreviewVisible(false)}></TaskPreview> : '' }
      <Modal className="takeover-modal" buttons={takeOverModal.buttons} closeButtonName={'Zamknij'} title={takeOverModal.title} description={takeOverModal.description} visible={takeOverModalVisible} onClose={() => setTakeOverModalVisible(false)}></Modal>
      <Modal buttons={[]} closeButtonName={'Zamknij'} title={activeTasksModal.title} description={activeTasksModal.description} visible={tasksVisible} onClose={() => setTasksVisible(false)}></Modal>
      
      <div className="bottom-pin-wrapper">
          <div className="bottom-pin">
              <Row className="no-margins">
                  <Col className="text-right btn-center-container">                
                      <Button onClick={createTaskAndRenderResponse} className="btn-inverted btn-start btn-center" disabled={!selectedRep || taskStarted}>Start</Button>                          
                  </Col>
              </Row>
          </div>
        </div>
    </div>
  );
}
export default  WithContexts(RepresentativesSearch, [RepresentativeSearchContext, TaskContext]);