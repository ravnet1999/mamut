import React from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { RepresentativeCreationContext } from '../../Contexts/RepresentativeCreationContext';
import useRepresentativeCreationEffects from '../../Hooks/useRepresentativeCreationEffects';
import Modal from '../Modal/Modal';
import Button from 'react-bootstrap/Button';

const RepresentativeCreation = (props) => {
  useRepresentativeCreationEffects(props);

  const { 
    repCreationFormVisible, repCreationFormModal, dispatch, hideRepCreationForm, showRepCreationForm
  } = props;



  return (
    <>
      <Button onClick={(e) => dispatch(showRepCreationForm(<div>Tutaj będzie formularz</div>))}>Dodaj nowego użytkownika</Button>
      <Modal buttons={[]} closeButtonName={'Zamknij'} title={repCreationFormModal.title} description={repCreationFormModal.description} visible={repCreationFormVisible} onClose={() => dispatch(hideRepCreationForm())}></Modal>
    </>
  );
}

export default WithContexts(RepresentativeCreation, [ RepresentativeCreationContext ]);