const cron = require('node-cron');
const Task = require('../Model/TaskModel');
const Employee = require('../Model/EmpModel');

cron.schedule('*/30 * * * *', async () => {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours ahead

  const tasks = await Task.find({
    deadline: { $lt: upcoming, $gt: now },
    status: { $ne: 'Completed' }
  }).populate('assignedTo');

  for (const task of tasks) {
    console.log(`Reminder: Task "${task.title}" assigned to ${task.assignedTo?.name} is due soon!`);
    // TODO: Send email or push notification here
  }
});
