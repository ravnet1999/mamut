import React, { useEffect } from 'react';
import RepresentativeCreationFormModal from '../Components/RepresentativeCreation/RepresentativeCreationFormModal';

const useRepresentativeCreationEffects = (props) => {
  const {repCreationFormModalVisible, dispatch, updateRepCreationFormModal, response, form, client, location } = props;

  useEffect(() => {  
    dispatch(updateRepCreationFormModal({title:'', description: <RepresentativeCreationFormModal {...props}></RepresentativeCreationFormModal>}))    
  }, [repCreationFormModalVisible, response, form, client, location]);
}

export default useRepresentativeCreationEffects;