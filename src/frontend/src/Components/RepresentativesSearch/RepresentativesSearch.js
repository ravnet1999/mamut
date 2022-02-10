import React, { useState, useEffect } from 'react';
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
import RepresentativeCreationContextProvider from '../../Contexts/RepresentativeCreationContext';
import RepresentativeCreation from '../RepresentativeCreation/RepresentativeCreation';

const RepresentativesSearch = (props) => {
  useTaskEffects(props);
   
  const [response, setResponse] = useState(null);
  const [tasksCountVisible, setTasksCountVisible] = useState(true);
  const [startButtonVisible, setStartButtonVisible] = useState(true);

  const { 
    suggestions, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected, getSuggestionValue, renderSuggestion, inputProps,
    selectedRepId, selectedRep, selectedClientId, fetchWithTasksAndSelectRep, updateValue,
    createTask, taskStarted, tasksVisible, setTasksVisible, activeTasksModal, takeOverModalVisible, setTakeOverModalVisible, takeOverModal, taskPreviewVisible, setTaskPreviewVisible, previewedTask, changeOperator,
  } = props;

  useEffect(() => {
    setTasksCountVisible( selectedRep || suggestions.length > 0 ? false : true);
  }, [selectedRep, suggestions])
  
  const onSuggestionsFetchRequestedWithResponse = async (event, data) => {
    try {
      onSuggestionsFetchRequested(event, data);   
    } catch (err) {
      setResponse({
        error: true,
        messages: [ err ]
      }); 
    }
  }

  const onSuggestionSelectedWithResponse = async (event, data) => {
    try {
      onSuggestionSelected(event, data);   
    } catch (err) {
      setResponse({
        error: true,
        messages: [ err ]
      }); 
    }
  }

  const createTaskAndRenderResponse = (event) => {
    setResponse({
      error: false,
      messages: [ 'Tworzenie zadania...' ]
    });

    createTask(selectedRepId, selectedClientId)
    .then(result => {
      setResponse(result);
    })
    .catch(err => {
      setResponse({
        error: true,
        messages: [ err ]
      });
    });
  }

  // Finally, render it!
  return (
    <div className="representatives-search-box">
      { response && response.messages.length > 0 && <Alert response={response}></Alert> }
      
      <div className="react-autosuggest__box">
        <div className="react-autosuggest__row">
          <div className="react-autosuggest__column">Znajdź użytkownika:</div>
          <div className="react-autosuggest__column">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequestedWithResponse}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              onSuggestionSelected={onSuggestionSelectedWithResponse}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </div>
          <div className="react-autosuggest__column">
            <RepresentativeCreationContextProvider>
                <RepresentativeCreation { ...props } fetchWithTasksAndSelectRep={ fetchWithTasksAndSelectRep } updateValue={ updateValue } setStartButtonVisible={ setStartButtonVisible }></RepresentativeCreation>
            </RepresentativeCreationContextProvider>
          </div>
        </div>

        { tasksCountVisible  && <div className="react-autosuggest__row">
          <div className="react-autosuggest__column">&nbsp;</div>
          <div className="react-autosuggest__column">
          Wyszukiwanie odbywa się po polach: numer telefonu oraz imię i nazwisko, a rozpocznie się po wpisaniu minimum trzech znaków.
          </div>
        </div> }

        { selectedRep  && <div className="react-autosuggest__row">
          <div className="react-autosuggest__column">Aktywne zadania:</div>
          <div className="react-autosuggest__column react-autosuggest__task-count">
            <div onClick={() => changeOperator(selectedRep)}>
              ({selectedRep.activeTasks.length})
            </div> 
          </div>
        </div> }
      </div>

      { taskPreviewVisible ? <TaskPreview task={previewedTask} onClose={() => setTaskPreviewVisible(false)}></TaskPreview> : '' }
      <Modal className="takeover-modal" buttons={takeOverModal.buttons} closeButtonName={'Zamknij'} title={takeOverModal.title} description={takeOverModal.description} visible={takeOverModalVisible} onClose={() => setTakeOverModalVisible(false)}></Modal>
      <Modal buttons={[]} closeButtonName={'Zamknij'} title={activeTasksModal.title} description={activeTasksModal.description} visible={tasksVisible} onClose={() => setTasksVisible(false)}></Modal>
      
      { startButtonVisible && 
        <div className="bottom-pin-wrapper">
          <div className="bottom-pin">
            <Row className="no-margins">
              <Col className="text-right btn-center-container">                
                <Button onClick={createTaskAndRenderResponse} className="btn-inverted btn-start btn-center" disabled={!selectedRep || taskStarted}>Start</Button>                          
              </Col>
            </Row>
          </div>
        </div>
      }
    </div>
  );
}
export default WithContexts(RepresentativesSearch, [RepresentativeSearchContext, TaskContext]);