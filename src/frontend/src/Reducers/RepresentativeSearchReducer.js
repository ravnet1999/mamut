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
    case('SET_RESPONSE'):
      return {
        ...state,
        response: action.response
      }  
    case('SET_SUCCESS_RESPONSE'):
    return {
      ...state,
      response: {
        error: false,
        messages: [action.message]
      }
    }
    case('SET_ERROR_RESPONSE'):
      return {
        ...state,
        response: {
          error: true,
          messages: [action.err]
        }
      }
    case('SET_TASK_STARTED'):
      return {
        ...state,
        taskStarted: action.taskStarted        
      }     
  }
  return state;
}

export default representativeSearchReducer;

