import React from 'react';
import './RepresentativeCreation.css';
import { WithContexts } from '../../HOCs/WithContexts';
import { RepresentativeCreationContext } from '../../Contexts/RepresentativeCreationContext';
import useRepresentativeCreationEffects from '../../Hooks/useRepresentativeCreationEffects';
import Modal from '../Modal/Modal';
import Button from 'react-bootstrap/Button';

const RepresentativeCreation = (props) => {
  useRepresentativeCreationEffects(props);

  const { 
    repCreationFormModalVisible, repCreationFormModal, dispatch, hideRepCreationFormModal, showRepCreationFormModal, setStartButtonVisible, clearAll } = props;

  const createRep = (e) => {
    dispatch(showRepCreationFormModal());
    setStartButtonVisible(false);
  }

  const repCreationFormModalOnClose = () => {
    dispatch(hideRepCreationFormModal());
    setStartButtonVisible(true);
  }

  return (
    <>
      <div className="react-autosuggest__representative-creation-button">
        <Button onClick={createRep}>Dodaj nowego użytkownika</Button>
      </div>
      <Modal 
        className="react-autosuggest__representative-creation-modal" 
        buttons={[{ name: 'Wyczyść', method: clearAll } ]} 
        closeButtonName={'Zamknij'} 
        title={repCreationFormModal.title} 
        description={repCreationFormModal.description} 
        visible={repCreationFormModalVisible} 
        onClose={repCreationFormModalOnClose}>        
      </Modal>
    </>
  );
}

export default WithContexts(RepresentativeCreation, [ RepresentativeCreationContext ]);