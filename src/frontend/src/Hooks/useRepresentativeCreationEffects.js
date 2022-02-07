import React, { useEffect } from 'react';
import RepresentativeCreationFormModal from '../Components/RepresentativeCreation/RepresentativeCreationFormModal';

const useRepresentativeCreationEffects = (props) => {
  const {repCreationFormModalVisible, dispatch, updateRepCreationFormModal, response
  } = props;

  useEffect(() => {  
    dispatch(updateRepCreationFormModal({title:'', description: <RepresentativeCreationFormModal {...props}></RepresentativeCreationFormModal>}))    
  }, [repCreationFormModalVisible, response]);
}

export default useRepresentativeCreationEffects;