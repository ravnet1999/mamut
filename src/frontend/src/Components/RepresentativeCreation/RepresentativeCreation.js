import React from 'react';
import { WithContexts } from '../../HOCs/WithContexts';
import { RepresentativeCreationContext } from '../../Contexts/RepresentativeCreationContext';

const RepresentativeCreation = (props) => {
  
  return (
    <div className="representative-creation-box">
      Tu będzie przycisk do dodawania użytkownika
    </div>
  );
}
export default WithContexts(RepresentativeCreation, [RepresentativeCreationContext]);