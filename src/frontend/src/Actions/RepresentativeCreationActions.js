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

export const setClient = (data) => {
  return { type: 'SET_CLIENT', data };
};

export const setLocation = (data) => {
  return { type: 'SET_LOCATION', data };
};

export const setClients = (data) => {
  return { type: 'SET_CLIENTS', data };
};

export const setLocations = (data) => {
  return { type: 'SET_LOCATIONS', data };
};

export const clearForm = (data) => {
  return { type: 'CLEAR_FORM', data };
};

export const clearClient = (data) => {
  return { type: 'CLEAR_CLIENT', data };
};

export const clearLocation = (data) => {
  return { type: 'CLEAR_LOCATION', data };
};

export const clearResponse = (data) => {
  return { type: 'CLEAR_RESPONSE', data };
};

export const clearAllFields = (data) => {
  return { type: 'CLEAR_ALL_FIELDS', data };
};

export const clearAllFieldsExceptClient = (data) => {
  return { type: 'CLEAR_ALL_FIELDS_EXCEPT_CLIENT', data };
};