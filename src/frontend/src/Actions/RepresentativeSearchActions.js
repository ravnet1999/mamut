export const setValue = (value) => { 
  return { type: 'SET_VALUE', value };
};

export const setSuggestions = (suggestions) => { 
  return { type: 'SET_SUGGESTIONS', suggestions };
};

export const clearSuggestions = () => { 
  return { type: 'CLEAR_SUGGESTIONS' };
};

export const selectRep = (data) => { 
  return { type: 'SELECT_REP', data };
};

export const setResponse = (response) => {
  return { type: 'SET_RESPONSE', response };
};


export const setSuccessResponse = (message) => {
  return { type: 'SET_SUCCESS_RESPONSE', message };
};

export const setErrorResponse = (err) => {
  return { type: 'SET_ERROR_RESPONSE', err };
};