import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskDashboard.css';


const TaskDashboard = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'High',
    skillRequired: ''
  });

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');  // New state for search input

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!form.skillRequired.trim()) {
      alert("Please enter at least one required skill.");
      return;
    }

    const skillArray = form.skillRequired.split(',').map(skill => skill.trim());

    try {
      const response = await axios.post('http://localhost:5000/api/tasks/create', {
        ...form,
        skillRequired: skillArray,
      });

      setTasks(prev => [...prev, response.data.task]);
      setForm({
        title: '',
        description: '',
        deadline: '',
        priority: 'High',
        skillRequired: ''
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/update/${taskId}`, {
        status: newStatus
      });

      setTasks(tasks.map(task =>
        task._id === taskId ? response.data.task : task
      ));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (taskId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`);
    setTasks(tasks.filter(task => task._id !== taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};


  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditForm({
      ...task,
      skillRequired: task.skillRequired?.join(', ') || ''
    });
  };

  const saveTask = async () => {
    try {
      const skillArray = editForm.skillRequired.split(',').map(skill => skill.trim());

      const response = await axios.put(`http://localhost:5000/api/tasks/updatefull/${editingTaskId}`, {
        ...editForm,
        skillRequired: skillArray
      });

      setTasks(tasks.map(task =>
        task._id === editingTaskId ? response.data.task : task
      ));
      setEditingTaskId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (search === '') return true;  // If search is empty, show all tasks
    return task.assignedTo?.name.toLowerCase().includes(search.toLowerCase());
  });

  


  return (
    <div className="task-dashboard">
      <h2 className="dashboard-title">Smart Task Assistant</h2>

     

      {/* Search Bar */}
      <div className="search">
        <input
          type="text"
          placeholder="Search by assigned employee"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <form onSubmit={createTask} className="task-form">
        <h3 className="form-heading">Create New Task</h3>

        <div className="form-row">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="form-input"
            required
          />
          <input
            type="date"
            value={form.deadline}
            onChange={e => setForm({ ...form, deadline: e.target.value })}
            className="form-input"
          />
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="form-textarea"
        ></textarea>

        <div className="form-row">
          <select
            value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}
            className="form-input"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            type="text"
            placeholder="Required Skills"
            value={form.skillRequired}
            onChange={e => setForm({ ...form, skillRequired: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-button">Create Task</button>
      </form>

      <div className="task-grid">
        {filteredTasks.map(task => (
          <div key={task._id} className="task-card">
            {task._id === editingTaskId ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                  className="edit-input"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description"
                  className="edit-textarea"
                />
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="edit-input"
                />
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  className="edit-input"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <p><strong>Assigned To:</strong> {editForm.assignedTo?.name || 'Unassigned'}</p>
                <input
                  type="text"
                  value={editForm.skillRequired}
                  onChange={(e) => setEditForm({ ...editForm, skillRequired: e.target.value })}
                  placeholder="Required Skills"
                  className="edit-input"
                />
                <button onClick={saveTask} className="btn-save">Save</button>
              </div>
            ) : (
              <>
                <h3 className="task-title">{task.title}</h3>
                <p className="task-desc">{task.description}</p>
                <p className="task-meta"><strong>Assigned to:</strong> {task.assignedTo?.name || 'Unassigned'}</p>
                <p className="task-meta"><strong>Status:</strong> {task.status}</p>
                <p className="task-meta"><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</p>
                <p className="task-meta"><strong>Skills:</strong> {task.skillRequired?.join(', ') || 'N/A'}</p>

                {task.status !== 'Completed' && (
                  <div className="task-buttons">
                    <button onClick={() => updateStatus(task._id, 'In Progress')} className="btn-progress">In Progress</button>
                    <button onClick={() => updateStatus(task._id, 'Completed')} className="btn-complete">Complete</button>
                  </div>
                )}

                <div className="task-buttons">
                  <button onClick={() => startEditing(task)} className="btn-edit">Edit</button>
                  <button onClick={() => deleteTask(task._id)} className="btn-delete">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDashboard;
