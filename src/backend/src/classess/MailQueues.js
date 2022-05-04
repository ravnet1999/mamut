const redisConfig = require('../../config/redis.json');
const Queue = require('bull');
const Mailer = require('../classess/Mailer');

const taskDeadlineMailQueue = new Queue('task_deadline_mail queue', { redis: { port: redisConfig.port, host: redisConfig.host, password: redisConfig.password } });

taskDeadlineMailQueue.process(async function (job, done) {
  console.log(`processing job`);
  
  const mailerDeadline = new Mailer('deadline');
  mailerDeadline.send(mailerDeadline.getConfig().from, 'alicja.konopka@wp.pl', 'Powiadomienie o terminie zadania', 'text', '<h1>Powiadomienie html</h1><p>tekst</p>');           
  done();
});

exports.taskDeadlineMailQueue = taskDeadlineMailQueue;