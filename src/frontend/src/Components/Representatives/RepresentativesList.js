import React from 'react';
import { Row, Col } from '../bootstrap';
import RepresentativeCreationContextProvider from '../../Contexts/RepresentativeCreationContext';
import RepresentativeCreation from '../RepresentativeCreation/RepresentativeCreation';

const RepresentativesList = (props) => {
  let { afterRepCreated, afterRepCreationButtonClicked, afterRepCreationFormModalClosed, clientColumns } = props;

  return (
    <Row>
      <Col xs="12" sm="12" md="6" lg="4">
      <RepresentativeCreationContextProvider>
        <RepresentativeCreation { ...props } afterRepCreated={ afterRepCreated } afterRepCreationButtonClicked={ afterRepCreationButtonClicked } afterRepCreationFormModalClosed={ afterRepCreationFormModalClosed }></RepresentativeCreation>
      </RepresentativeCreationContextProvider>
      </Col>

      {clientColumns()}
    </Row>
  );
}

export default RepresentativesList;