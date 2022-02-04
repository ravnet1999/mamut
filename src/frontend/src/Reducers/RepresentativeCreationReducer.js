const representativeCreationReducer = (state, action) => {
  switch(action.type) {
    case('HIDE_REP_CREATION_FORM'):
      return {
        ...state,
        repCreationFormVisible: false
      }
    case('SHOW_REP_CREATION_FORM'):
      return {
        ...state,
        repCreationFormVisible: true,
        repCreationFormModal: {
            title: 'Dodawanie nowego użytkownika',
            description: action.data
        }
      }  
    default:
      return state; 
  }
}

export default representativeCreationReducer;

