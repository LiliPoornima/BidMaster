const express = require('express');
const router = express.Router();
const taskController = require('../Controlers/TaskControl');
const Task = require("../Model/TaskModel");
// Create new task
router.post('/create', taskController.createTask);

// Update task status only
router.put('/update/:taskId', taskController.updateTaskStatus);

// Get all tasks
router.get('/', taskController.getAllTasks);

router.get('/pending-count', taskController.getPendingTaskCount);
router.get('/in-progress-count', taskController.getInProgressTaskCount);
router.get('/completed-count', taskController.getCompletedTaskCount);
router.get('/recent',taskController.getRecentTasks);
// Delete task
router.delete('/delete/:taskId', taskController.deleteTask);

// Full update of task
router.put('/updatefull/:taskId', taskController.updateTask);

router.get('/due-soon', taskController.getDueSoonTasks);








module.exports = router;
