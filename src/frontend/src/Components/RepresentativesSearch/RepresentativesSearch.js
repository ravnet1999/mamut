import React, { useState } from 'react';
import './RepresentativesSearch.css';
import Alert from '../Alert/Alert';
import Autosuggest from 'react-autosuggest';
import UserClientHandler from '../../Handlers/UserClientHandler';
import TaskHandler from '../../Handlers/TaskHandler';
import { Row, Col, Button } from '../bootstrap';

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => 
`${suggestion.imie} ${suggestion.nazwisko}, ${!!(suggestion.tel_komorkowy)?suggestion.tel_komorkowy:""}, ${!!(suggestion.numer_wewnetrzny)?suggestion.numer_wewnetrzny:""}, ${suggestion.nazwa}`;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {getSuggestionValue(suggestion)}
  </div>
);


class RepresentativesSearch extends React.Component {

  constructor(props) {
    super(props);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: [],
      response: { messages: ['Wyszukaj reprezentanta, którego będziesz obsługiwał:']},
      selectedClientId: null,
      selectedRepId: null,
      taskStarted: false
    };
  }

  onChange = (event, { newValue }) => { 
    this.setState({
      value: newValue,
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = async ({ value }) => {
    try{
      let result = await UserClientHandler.findByPhoneNumber(value);
      let suggestions = result.resources.resources;

      this.setState({
        suggestions,
        selectedClientId: null,
        selectedRepId: null,
      });
    } catch{
      
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    this.setState({
      selectedClientId: suggestion.id_klienta,
      selectedRepId: suggestion.id
    }); 
  }


  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Podaj nr telefonu',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <div class="representatives-search-box">
        <Alert response={this.state.response}></Alert>

        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />

        <div className="bottom-pin-wrapper">
                <div className="bottom-pin">
                    <Row className="no-margins">
                        <Col className="text-right btn-center-container">
                            {/* <Alert response={response}></Alert> */}
                            <Button onClick={(e) => this.createTask()} className="btn-inverted btn-start btn-center" disabled={!this.state.selectedRepId || this.state.taskStarted}>Start</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
  }

  createTask = () => {
    this.setState({
      taskStarted: true,
      response:{
        error: false,
        messages: ['Tworzenie zadania...']
      }
    });
    
    TaskHandler.createTask(this.state.selectedClientId, this.state.selectedRepId).then((result) => {      
        this.setState({response: result});
    }).catch((err) => {      
      this.setState({response: err})
    });
  }
}

export default RepresentativesSearch;