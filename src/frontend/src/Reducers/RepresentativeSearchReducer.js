const representativeSearchReducer = (state, action) => {
  switch(action.type) {
    case('SET_VALUE'):
      return {
        ...state,
        value: action.value
      }
    case('SET_SUGGESTIONS'):
      return {
        ...state,
        suggestions: action.suggestions,
        selectedClientId: null,
        selectedRepId: null,
        selectedRep: null,
      }
    case('CLEAR_SUGGESTIONS'):
      return {
        ...state,
        suggestions: []
      } 
    case('SELECT_REP'):
      return {
        ...state,
        ...action.data
      }  
  }
  return state;
}

export default representativeSearchReducer;

