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
    repCreationFormModalVisible, repCreationFormModal, dispatch, hideRepCreationFormModal, showRepCreationFormModal, setStartButtonVisible, clearAllFields, clearResponse, form, client, location, setResponse, fetchWithTasksAndSelectRep, updateValue } = props;

  const repCreationButtonOnClick = (e) => {
    dispatch(showRepCreationFormModal());
    setStartButtonVisible(false);
  }

  const repCreationFormModalOnClose = () => {
    dispatch(hideRepCreationFormModal());
    setStartButtonVisible(true);
  }

  const clearAllFieldsAndResponse = () => {
    dispatch(clearAllFields());
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
        let repId = response.resources[0].id;
        await fetchWithTasksAndSelectRep(repId);
        await updateValue(repId);
        dispatch(hideRepCreationFormModal());
        setStartButtonVisible(true);
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
        <Button onClick={repCreationButtonOnClick}>Dodaj nowego reprezentanta</Button>
      </div>
      <Modal 
        className="react-autosuggest__representative-creation-modal" 
        buttons={[{ name: 'Dodaj', method: sendForm }, { name: 'Wyczyść', method: clearAllFieldsAndResponse } ]} 
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