import React from 'react';
import './RepresentativesSearch.css';
import Alert from '../Alert/Alert';
import Autosuggest from 'react-autosuggest';
import TaskHandler from '../../Handlers/TaskHandler';
import { Row, Col, Button } from '../bootstrap';
import { RepresentativeSearchContext } from '../../Contexts/RepresentativeSearchContext';
import { setValue, setSuggestions, clearSuggestions, selectRep, setResponse, setSuccessResponse, setErrorResponse, setTaskStarted } from '../../Actions/RepresentativeSearchActions';
import UserClientHandler from '../../Handlers/UserClientHandler';

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => 
`${suggestion.imie} ${suggestion.nazwisko}, ${!!(suggestion.tel_komorkowy)?suggestion.tel_komorkowy + ", ":""}${!!(suggestion.numer_wewnetrzny)?suggestion.numer_wewnetrzny + ", ":""}${suggestion.nazwa}`;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {getSuggestionValue(suggestion)}
  </div>
);

class RepresentativesSearch extends React.Component {
  static contextType = RepresentativeSearchContext;

  componentDidMount() {    
    this.setState({...this.context});
  }

  onSuggestionsFetchRequested = async ({ value }) => {
    try{
      let result = await UserClientHandler.findByPhoneNumber(value);
      let suggestions = result.resources.resources;

      this.context.dispatch(setSuggestions(suggestions));
    } catch (err) {
      this.context.dispatch(setErrorResponse(err));
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.context.dispatch(clearSuggestions());
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    this.context.dispatch(selectRep({ selectedRepId: suggestion.id, selectedClientId: suggestion.id_klienta })); 
  }

  createTask = async (event) => {
    this.context.dispatch(setSuccessResponse('Tworzenie zadania...'));
    this.context.dispatch(setTaskStarted(true));

    try {
      let result = await TaskHandler.createTask(this.context.selectedClientId, this.context.selectedRepId);
      this.context.dispatch(setResponse(result));
    } catch (err) {
      this.context.dispatch(setErrorResponse(err));
    }
  }

  render() {
    const { value, suggestions, response, dispatch, selectedRepId, taskStarted } = this.context;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      value,
      onChange: (event, { newValue }) => { 
        dispatch(setValue(newValue))
      }
    };

    // Finally, render it!
    return (
      <div className="representatives-search-box">
        <Alert response={response}></Alert>
        
        <div className="react-autosuggest__box">
          <div className="react-autosuggest__column">Znajdź użytkownika<br/>po numerze telefonu:</div>
          <div className="react-autosuggest__column">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              onSuggestionSelected={this.onSuggestionSelected}
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
                        <Button onClick={this.createTask} className="btn-inverted btn-start btn-center" disabled={!selectedRepId || taskStarted}>Start</Button>                        
                    </Col>
                </Row>
            </div>
          </div>
      </div>
    );
  }  
}

export default RepresentativesSearch;