import React, {createContext, useState } from 'react';

export const TaskAppendicesContext = createContext();

const TaskAppendicesContextProvider = ({children}) => {
  
  return (
    <div>
      <TaskAppendicesContext.Provider value={{  }} >
        {children}
      </TaskAppendicesContext.Provider>
    </div>
  );
}

export default TaskAppendicesContextProvider;