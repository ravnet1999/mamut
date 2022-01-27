import React, {useContext} from 'react';
import './RepresentativesSearch.css';
import Alert from '../Alert/Alert';
import Autosuggest from 'react-autosuggest';
import { Row, Col, Button } from '../bootstrap';
import { RepresentativeSearchContext } from '../../Contexts/RepresentativeSearchContext';
import { TaskContext } from '../../Contexts/TaskContext';
import RepresentativeActiveTasks from './RepresentativeActiveTasks';
import {WithContexts} from '../../HOCs/WithContexts'

const RepresentativesSearch = (props) => {
  const { 
    dispatch, 
    response, setResponse, setSuccessResponse, setErrorResponse, 
    suggestions, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected, getSuggestionValue, renderSuggestion, inputProps,
    selectedRepId, selectedClientId,
    createTask, taskStarted    
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

      <RepresentativeActiveTasks selectedRepId={selectedRepId}></RepresentativeActiveTasks>

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
export default  WithContexts(RepresentativesSearch, [RepresentativeSearchContext, TaskContext]);