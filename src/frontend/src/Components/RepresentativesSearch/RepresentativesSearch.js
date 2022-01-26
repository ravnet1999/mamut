import React, {useContext} from 'react';
import './RepresentativesSearch.css';
import Alert from '../Alert/Alert';
import Autosuggest from 'react-autosuggest';
import { Row, Col, Button } from '../bootstrap';
import { RepresentativeSearchContext } from '../../Contexts/RepresentativeSearchContext';
import { TaskContext } from '../../Contexts/TaskContext';

const RepresentativesSearch = () => {
  const representativeSearchContext = useContext(RepresentativeSearchContext);
  const taskContext = useContext(TaskContext);

  const { dispatch, setResponse, setErrorResponse, setSuccessResponse, suggestions, response, selectedRepId, selectedClientId, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected, inputProps, getSuggestionValue, renderSuggestion } = representativeSearchContext;
  const { taskStarted, createTask } = taskContext;

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

      <div className="react-tasks-count__box">
        <div className="react-tasks-count__column">Zadania:</div>
        <div className="react-tasks-count__column">
          (5)
        </div>
      </div>

      <div className="bottom-pin-wrapper">
          <div className="bottom-pin">
              <Row className="no-margins">
                  <Col className="text-right btn-center-container">                
                      <Button onClick={createTaskAndRenderResponse} className="btn-inverted btn-start btn-center" disabled={!selectedRepId || taskStarted}>Start</Button>                          
                  </Col>
              </Row>
          </div>
        </div>
    </div>
  );
}

export default RepresentativesSearch;