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
        tasksCountVisible: action.suggestions.length > 0 ? false : true
      }
    case('CLEAR_SUGGESTIONS'):
      return {
        ...state,
        suggestions: [],
        tasksCountVisible: true
      } 
    case('SELECT_REP'):
      return {
        ...state,
        ...action.data,
        tasksCountVisible: false
      }  
  }
  return state;
}

export default representativeSearchReducer;

