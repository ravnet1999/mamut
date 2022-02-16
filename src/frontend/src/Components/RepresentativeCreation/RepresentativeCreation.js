import React from 'react';
import './RepresentativeCreation.css';
import { WithContexts } from '../../HOCs/WithContexts';
import { RepresentativeCreationContext } from '../../Contexts/RepresentativeCreationContext';
import useRepresentativeCreationEffects from '../../Hooks/useRepresentativeCreationEffects';
import Modal from '../Modal/Modal';
import Button from 'react-bootstrap/Button';
import UserHandler from '../../Handlers/UserHandler';

const RepresentativeCreation = (props) => {
  useRepresentativeCreationEffects(props);

  const { 
    repCreationFormModalVisible, repCreationFormModal, dispatch, hideRepCreationFormModal, showRepCreationFormModal, clearAllFields, clearAllFieldsExceptClient, clearResponse, form, client, pickedClient, location, setResponse, afterRepCreationButtonClicked, afterRepCreationFormModalClosed, afterRepCreated } = props;

  const repCreationButtonOnClick = (e) => {
    dispatch(showRepCreationFormModal());
    afterRepCreationButtonClicked();    
  }

  const repCreationFormModalOnClose = () => {
    dispatch(hideRepCreationFormModal());
    afterRepCreationFormModalClosed();    
  }

  const clearAllFieldsAndResponse = (pickedClient) => () => {
    if(pickedClient) {
      dispatch(clearAllFieldsExceptClient());
    } else {
      dispatch(clearAllFields());
    }
    dispatch(clearResponse());
    
    
  }

  const sendForm = async () => {  
    try{
      let response = await UserHandler.create({
        'imie': form.firstname, 
        'nazwisko': form.name, 
        'tel_komorkowy': form.phone, 
        'adres_email': form.email, 
        'id_klienta': client, 
        'lokalizacja': location
      });

      if(response.error === false) {
        dispatch(clearAllFields());
        dispatch(hideRepCreationFormModal());

        let repId = response.resources[0].id;
        afterRepCreated(repId);
      } else {
        dispatch(setResponse(response));
      }
    } catch(err) {
      dispatch(setResponse(err));           
    };        
  }

  return (
    <>
      <div className="react-autosuggest__representative-creation-button">
        <Button className={ `full-width margin-bottom-default` }  onClick={repCreationButtonOnClick}>Dodaj nowego reprezentanta</Button>
      </div>
      <Modal 
        className="react-autosuggest__representative-creation-modal"
        buttons={[{ name: 'Dodaj', method: sendForm }, { name: 'Wyczyść', method: clearAllFieldsAndResponse(pickedClient) } ]} 
        closeButtonName={'Zamknij bez dodawania'} 
        title={repCreationFormModal.title} 
        description={repCreationFormModal.description} 
        visible={repCreationFormModalVisible} 
        onClose={repCreationFormModalOnClose}>        
      </Modal>
    </>
  );
}

export default WithContexts(RepresentativeCreation, [ RepresentativeCreationContext ]);