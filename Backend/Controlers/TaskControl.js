const Task = require('../Model/TaskModel');
const Employee = require('../Model/EmpModel');
const Notification = require('../Model/TaskNotificationModel');

// Utility to assign best employee based on skills & workload
const assignTaskToBestEmployee = async (taskSkills) => {
  const employees = await Employee.find();

  const suitable = employees.filter(emp =>
    taskSkills.every(skill => emp.skills?.includes(skill))
  );

  if (suitable.length === 0) return null;

  suitable.sort((a, b) => (a.taskHistory?.length || 0) - (b.taskHistory?.length || 0));

  return suitable[0];
};

// Create and assign task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, skillRequired } = req.body;

    if (!title || !description || !priority || !deadline || !skillRequired || !Array.isArray(skillRequired)) {
      return res.status(400).json({ message: 'Missing or invalid task fields.' });
    }

    const bestEmployee = await assignTaskToBestEmployee(skillRequired);

    const newTask = new Task({
      title,
      description,
      priority,
      deadline,
      skillRequired,
      assignedTo: bestEmployee?._id || null,
      status: 'Pending'
    });

    const savedTask = await newTask.save();

    // Update employee's task history
    if (bestEmployee) {
      bestEmployee.taskHistory = bestEmployee.taskHistory || [];
      bestEmployee.taskHistory.push({ taskId: savedTask._id, status: 'Pending' });
      await bestEmployee.save();
    

    // Create a notification
  const notification = new Notification({
    message: `New task "${title}" assigned to you.`,
    username: bestEmployee.username
  });
  await notification.save();
}

    // Populate assigned employee name for frontend display
    await savedTask.populate('assignedTo', 'name');

    res.status(201).json({ message: 'Task created successfully.', task: savedTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update task status (only status and optional performanceScore)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, performanceScore } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    if (performanceScore !== undefined) task.performanceScore = performanceScore;

    await task.save();
    await task.populate('assignedTo', 'name');

    res.status(200).json({ message: 'Task status updated', task });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Full update for task (edit form)
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true }).populate('assignedTo', 'name');

    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task updated', task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted', task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

exports.getPendingTaskCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ status: 'Pending' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending task count' });
  }
};


exports.getInProgressTaskCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ status: "In Progress" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching in-progress task count", error });
  }
};

// Count of tasks with status "Completed"
exports.getCompletedTaskCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ status: "Completed" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching completed task count", error });
  }
};

// Controller function
exports.getRecentTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('assignedTo', 'name employeeId'); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks due in next 24 hours
exports.getDueSoonTasks = async (req, res) => {
  try {
    const now = new Date();
    const upcoming = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      deadline: { $lt: upcoming, $gt: now },
      status: { $ne: 'Completed' }
    }).populate('assignedTo');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch due-soon tasks' });
  }
};
