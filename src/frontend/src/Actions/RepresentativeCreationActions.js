export const hideRepCreationFormModal = () => { 
  return { type: 'HIDE_REP_CREATION_FORM_MODAL' };
};

export const showRepCreationFormModal = () => {
  return { type: 'SHOW_REP_CREATION_FORM_MODAL' };
};

export const updateRepCreationFormModal = (data) => {
  return { type: 'UPDATE_REP_CREATION_FORM_MODAL', data };
};

export const updateForm = (data) => {
  return { type: 'UPDATE_FORM', data };
};

export const setResponse = (data) => {
  return { type: 'SET_RESPONSE', data };
};
