import React from 'react';
import './RepresentativesSearch.css';
import Alert from '../Alert/Alert';
import Autosuggest from 'react-autosuggest';
import { Row, Col, Button } from '../bootstrap';
import { RepresentativeSearchContext } from '../../Contexts/RepresentativeSearchContext';

class RepresentativesSearch extends React.Component {
  static contextType = RepresentativeSearchContext;

  componentDidMount() {    
    this.setState({...this.context});
  }

  render() {
    const { suggestions, response, selectedRepId, taskStarted, onSuggestionsFetchRequested, onSuggestionsClearRequested, onSuggestionSelected, createTask, inputProps, getSuggestionValue, renderSuggestion } = this.context;

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
                        <Button onClick={createTask} className="btn-inverted btn-start btn-center" disabled={!selectedRepId || taskStarted}>Start</Button>                        
                    </Col>
                </Row>
            </div>
          </div>
      </div>
    );
  }  
}

export default RepresentativesSearch;