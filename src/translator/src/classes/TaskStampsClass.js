taskStampService = require('../services/Task/TaskStampService');

class TaskStamps {
    constructor(task) {
        this.task = task;
        if(task) {
            return this.fetchStamps();
        };
    }

    static fetchTasksStamps = (tasks) => {
        if(tasks.length <= 0) return [];
        let taskIds = tasks.map((task) => {
            return task.body.id;
        });

        console.log(taskIds);

        return taskStampService.stampsForTasks(taskIds).then((stamps) => {
            let tasksWithStamps = tasks.map((task) => {
                task.stamps = stamps.filter((stamp) => {
                    return stamp.id_zgloszenia == task.body.id;
                });
                return task;
            });

            return tasksWithStamps;
        });
    }

    fetchStamps = () => {
        return taskStampService.lastStamp(this.task.body.id).then((stamps) => {
            this.task.stamps = stamps;
            return this.task;
        });
    }
}

module.exports = TaskStamps;