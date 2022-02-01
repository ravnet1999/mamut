import React, { useEffect } from 'react';
import Page from '../Page';
import RepresentativesSearch from './RepresentativesSearch';
import RepresentativeSearchContextProvider from '../../Contexts/RepresentativeSearchContext';
import TaskContextProvider from '../../Contexts/TaskContext';

const RepresentativesSearchPage = (props) => {
    useEffect(() => {
        props.setCurrentPage(props.history.location.pathname);
        return props.updateTaskCount;
    }, []);

    return (        
        <Page>
            <RepresentativeSearchContextProvider>
              <TaskContextProvider>
                <RepresentativesSearch {...props}></RepresentativesSearch>
              </TaskContextProvider>
            </RepresentativeSearchContextProvider>
        </Page>
    );
}

export default RepresentativesSearchPage;