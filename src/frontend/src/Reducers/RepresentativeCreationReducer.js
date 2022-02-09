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
    case('SET_CLIENT'):
      return {
        ...state,
        client: action.data,
        location: ''
      }
    case('SET_LOCATION'):
      return {
        ...state,
        location: action.data
      }   
    case('SET_CLIENTS'):
      return {
        ...state,
        clients: action.data
      }  
    case('SET_LOCATIONS'):
      return {
        ...state,
        locations: action.data
      } 
    case('CLEAR_FORM'):
      return {
        ...state,
        form: {
          firstname: '',
          name: '',
          email: '',
          phone: ''        
        },
      }
    case('CLEAR_CLIENT'):
      return {
        ...state,
        client: ''
      }    
    case('CLEAR_LOCATION'):
      return {
        ...state,
        location: ''
      }         
  }
}

export default representativeCreationReducer;

