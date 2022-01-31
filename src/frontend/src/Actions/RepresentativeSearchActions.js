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