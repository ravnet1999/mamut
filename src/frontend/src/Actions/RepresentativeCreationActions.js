export const hideRepCreationForm = () => { 
  return { type: 'HIDE_REP_CREATION_FORM' };
};

export const showRepCreationForm = (data) => {
  return { type: 'SHOW_REP_CREATION_FORM', data };
};
