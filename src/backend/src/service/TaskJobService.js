const { taskDeadlineMailQueue: mailQueue } = require('../classess/MailQueues');
const moment = require('moment');

class TaskJobService {
  addDeadlineMailJob = async (taskId, deadline) => { 
    let datetimeFormat = 'YYYY-MM-DD HH:mm:ss';
    let millisecondsBeforeDeadlineToSendMailAt = 3600 * 1000;

    let currentDatetime = moment();
    let millisecondsToDeadline = moment.duration(deadline.clone().diff(currentDatetime)).asMilliseconds();
    let jobDelay = millisecondsToDeadline - millisecondsBeforeDeadlineToSendMailAt;

    let datetimeToSendMailAt = deadline.clone().subtract(millisecondsBeforeDeadlineToSendMailAt, 'milliseconds');

    let jobIdPrefix = `${taskId}_termin_`;
    let jobId = jobIdPrefix + currentDatetime.unix();
    
    let delayedJobs = await mailQueue.getDelayed();
    let delayedJobsByJobId = delayedJobs.filter(job => job.id.includes(jobIdPrefix));

    delayedJobsByJobId.forEach(async (job) => {
      await job.remove(); 
    });

    console.log(millisecondsToDeadline, jobDelay, {                 
      taskDeadline: deadline.format(datetimeFormat),
      taskDeadlineMailJobId: jobId,
      taskDeadlineMailJobCreated: currentDatetime.format(datetimeFormat),
      taskDeadlineMailJobToProcess: datetimeToSendMailAt.format(datetimeFormat),                
    });

    if(jobDelay > 0) {
      await mailQueue.add({                 
        taskDeadline: deadline.format(datetimeFormat),
        taskDeadlineMailJobId: jobId,
        taskDeadlineMailJobCreated: currentDatetime.format(datetimeFormat),
        taskDeadlineMailJobToProcess: datetimeToSendMailAt.format(datetimeFormat),                
      }, { 
        delay: jobDelay, 
        jobId: jobId
      }); 
    }
  }
}

module.exports = new TaskJobService();