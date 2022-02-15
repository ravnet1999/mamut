import { useEffect } from 'react';

const useTasksEffects = (props) => {
  const { 
    setResponse, getTasks 
  } = props;

  useEffect(() => {
      setResponse({
          error: false,
          messages: ['Pobieranie zadań...'],
          resources: []
      })
      getTasks(props.match.params.general);
      props.setCurrentPage(props.history.location.pathname);

      return props.updateTaskCount;
  }, [props.match.params.general]);
}

export default useTasksEffects;