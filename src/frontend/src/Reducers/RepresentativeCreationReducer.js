const representativeCreationReducer = (state, action) => {
  switch(action.type) {
    case('HIDE_REP_CREATION_FORM_MODAL'):
      return {
        ...state,
        repCreationFormModalVisible: false
      }
    case('SHOW_REP_CREATION_FORM_MODAL'):
      return {
        ...state,
        repCreationFormModalVisible: true        
      }  
    case('UPDATE_REP_CREATION_FORM_MODAL'):
      return {
        ...state,
        repCreationFormModal: action.data        
      } 
    case('UPDATE_FORM'):      
      const newForm = {
        ...state.form
      };
      newForm[action.data.target.name] = action.data.target.value;

      return {
        ...state,
        form: newForm        
      } 
    case('SET_RESPONSE'):
      return {
        ...state,
        response: action.data
      }
  }
}

export default representativeCreationReducer;

