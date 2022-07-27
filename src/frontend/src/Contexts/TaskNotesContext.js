import React, {createContext, useState } from 'react';

export const TaskNotesContext = createContext();

const TaskNotesContextProvider = ({children}) => {
  return (
    <TaskNotesContext.Provider value={{}}>
      {children}
    </TaskNotesContext.Provider>
  );
}

export default TaskNotesContextProvider;