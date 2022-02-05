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
    default:
      return state; 
  }
}

export default representativeCreationReducer;

