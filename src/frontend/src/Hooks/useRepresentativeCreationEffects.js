import React, { useEffect } from 'react';
import RepresentativeCreationFormModal from '../Components/RepresentativeCreation/RepresentativeCreationFormModal';
import ClientHandler from '../Handlers/ClientHandler';

const useRepresentativeCreationEffects = (props) => {
  const { repCreationFormModalVisible, dispatch, updateRepCreationFormModal, response, form, client, location, clients, setClients } = props;

  useEffect(() => {  
    dispatch(updateRepCreationFormModal({title:'', description: <RepresentativeCreationFormModal {...props}></RepresentativeCreationFormModal>}))    
  }, [repCreationFormModalVisible, response, form, client, location, clients]);

  useEffect(() => {
    ClientHandler.getClients().then(response => {
      let sorted = response.resources.sort((a, b) => {
          return (a.nazwa) > (b.nazwa) ? 1 : ( (a.nazwa) < (b.nazwa) ? -1 : 0 );
      });
      dispatch(setClients(sorted));
    });
  }, []);

}

export default useRepresentativeCreationEffects;