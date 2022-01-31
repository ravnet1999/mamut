import { useEffect } from 'react';

const useTaskEffects = (props) => {
  const { 
    takeOverStarted, viewedOperator, viewedTaskList, taskForTakeOver, takeOverModalVisible, renderTaskList, showTasks, showTakeOverModal    
  } = props;

  useEffect(() => {
    if(!viewedOperator) return () => {

    };

    renderTaskList();
  }, [viewedOperator, takeOverStarted])

  useEffect(() => {
      if(!viewedOperator) return () => {

      };

      showTasks();
  }, [viewedTaskList]);

  useEffect(() => {
      if(!takeOverModalVisible || !taskForTakeOver) return () => {

      };

      showTakeOverModal();

  }, [takeOverModalVisible, taskForTakeOver, takeOverStarted]);  

  useEffect(() => {
    if(!takeOverModalVisible || !taskForTakeOver) return () => {

    };

    showTakeOverModal();

  }, [takeOverModalVisible, taskForTakeOver, takeOverStarted]);
}

export default useTaskEffects;