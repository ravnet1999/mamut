import React, { useEffect } from 'react';
import RepresentativeCreationFormModal from '../Components/RepresentativeCreation/RepresentativeCreationFormModal';

const useRepresentativeCreationEffects = (props) => {
  const {repCreationFormModalVisible, dispatch, updateRepCreationFormModal
  } = props;

  useEffect(() => {  
    dispatch(updateRepCreationFormModal({title:'', description: <RepresentativeCreationFormModal {...props}></RepresentativeCreationFormModal>}))    
  }, [repCreationFormModalVisible]);
}

export default useRepresentativeCreationEffects;