const taskService = require('../services/Task/TaskService');
const episodeService = require('../services/Task/TaskEpisodeService');
const operatorService = require('../services/OperatorService');
const charset = require('../helpers/charset');

class TaskHelper {
  getTasksByUsers = async (userIds) =>  {
    let allTasks = [];
    let allTasksIds = [];
    let allOperatorIds = [];
  
    let whereCondition = '`status` = \'open\'';
  
    if (userIds.length !== 0) {
      whereCondition += ' AND id_zglaszajacy IN (' + userIds.join(',') + ')';
    }
  
    let tasks = await taskService.find(9999999, 0, 'id', 'DESC', whereCondition);  
  
    let operatorIds = tasks.map((task) => {
      return task.informatyk;
    });
    allOperatorIds = operatorIds.filter((operatorId, index, self) => {
        return self.indexOf(operatorId) === index;
    });
    allTasksIds = tasks.map((task) => {
        return task.id;
    });
    allTasks = tasks;
    
    if( allTasksIds.length !== 0 ) {
      let episodes = await episodeService.find(99999999, 0, 'id', 'DESC', 'id_zgloszenia IN (' + allTasksIds.join(',') + ')');
  
      allTasks.map((task) => {
        task.lastEpisode = episodes.filter((episode) => {
            return episode.id_zgloszenia == task.id;
        })[0];
    
        return task;
      });
    
      let operators = await operatorService.findById(allOperatorIds);
      
      allTasks = allTasks.map((task) => {
        task.operator = {};
    
        let taskOperators = operators.filter((operator) => {
            return operator.id == task.informatyk;
        });
    
        if(taskOperators.length > 0) {
            delete taskOperators[0].login;
            delete taskOperators[0].haslo;
            task.operator = taskOperators[0];
        }
    
        return task;
      });
    }
  
    return allTasks;
  } 

  getUsersWithTasks = async (users, allTasks, response) =>  {
    let usersWithTasks = users.map((user) => {
      user = charset.translateIn(user);
      user.activeTasks = allTasks.filter((task) => {
          task = charset.translateIn(task);
          return task.id_klienta == user.id_klienta && task.id_zglaszajacy == user.id;
      });
      console.log(user.activeTasks, 'active tasks');
      return user;
    });
  
    return usersWithTasks;
  }
}

module.exports = new TaskHelper();