import React, { useEffect } from 'react';
import RepresentativeCreationFormModal from '../Components/RepresentativeCreation/RepresentativeCreationFormModal';
import ClientHandler from '../Handlers/ClientHandler';

const useRepresentativeCreationEffects = (props) => {
  const { repCreationFormModalVisible, dispatch, updateRepCreationFormModal, response, form, client, location, clients, setClients, locations, setLocations } = props;

  useEffect(() => {  
    dispatch(updateRepCreationFormModal({title:'', description: <RepresentativeCreationFormModal {...props}></RepresentativeCreationFormModal>}))    
  }, [repCreationFormModalVisible, response, form, client, location, clients, locations]);

  useEffect(() => {
    ClientHandler.getClients().then(response => {
      let sorted = response.resources.sort((a, b) => {
          return (a.nazwa) > (b.nazwa) ? 1 : ( (a.nazwa) < (b.nazwa) ? -1 : 0 );
      });
      dispatch(setClients(sorted));
    });
  }, []);

  useEffect(() => {
    if(client) {
      ClientHandler.getLocations(client).then(response => {      
        dispatch(setLocations(response.resources));
      });
    }
  }, [ client ]);
}

export default useRepresentativeCreationEffects;