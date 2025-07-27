import React, { useEffect, useState } from 'react'; 
import './HRDashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaMoneyCheckAlt, FaTasks, FaCheckCircle } from 'react-icons/fa';

const HRDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pendingPayrolls, setPendingPayrolls] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentPayrolls, setRecentPayrolls] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [dueSoonTasks, setDueSoonTasks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Summary counts
    axios.get('http://localhost:5000/api/employees/count')
      .then(res => setEmployeeCount(res.data.count))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/payroll/pending-count')
      .then(res => setPendingPayrolls(res.data.count))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/tasks/pending-count')
      .then(res => setPendingTasks(res.data.count))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/tasks/in-progress-count')
      .then(res => setInProgressTasks(res.data.count))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/tasks/completed-count')
      .then(res => setCompletedTasks(res.data.count))
      .catch(err => console.error(err));

    // Fetch recent employees
    axios.get('http://localhost:5000/api/employees/recent')
      .then(res => setRecentEmployees(res.data))
      .catch(err => console.error(err));

    // Fetch recent payrolls
    axios.get('http://localhost:5000/api/payroll/recent')
      .then(res => setRecentPayrolls(res.data))
      .catch(err => console.error(err));

    // Fetch recent tasks
    axios.get('http://localhost:5000/api/tasks/recent')
      .then(res => setRecentTasks(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/tasks/due-soon')
      .then(res => setDueSoonTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="hr-dashboard">
      <div className="hr-banner">
  <div className="banner-overlay">
    <h1 className="banner-title">HR Manager Dashboard</h1>
    <p className="hr-subtitle">Oversee workforce operations and streamline HR processes</p>
  </div>
</div>


      <h1 className="hr-title">Quick Access</h1>
      <div className="hr-action-cards">
        <div className="action-card" onClick={() => navigate('/employeeDashboard')}>
          <h3>👥 Employee Dashboard</h3>
          <p>View and manage employee records</p>
        </div>

        <div className="action-card" onClick={() => navigate('/addEmployee')}>
          <h3>👤 Add Employees</h3>
          <p>Add new employee records</p>
        </div>

        <div className="action-card" onClick={() => navigate('/payroll')}>
          <h3>💰 View Payroll</h3>
          <p>Manage and approve payrolls</p>
        </div>

        <div className="action-card" onClick={() => navigate('/tasks')}>
          <h3>🧠 Smart Task Assistant</h3>
          <p>Assign and track employee tasks</p>
        </div>
      </div>
      
      
 <h1 className="hr-title">Overview</h1>
      <div className="hr-summary-cards">
        <div className="hr-card">
          <FaUsers className="hr-icon" />
          <h2>Total Employees</h2>
          <p>{employeeCount}</p>
        </div>

        <div className="hr-card">
          <FaMoneyCheckAlt className="hr-icon" />
          <h2>Pending Payrolls</h2>
          <p>{pendingPayrolls}</p>
        </div>

        <div className="hr-card">
          <FaTasks className="hr-icon" />
          <h2>In Progress Tasks</h2>
          <p>{inProgressTasks}</p>
        </div>

        <div className="hr-card">
          <FaCheckCircle className="hr-icon" />
          <h2>Completed Tasks</h2>
          <p>{completedTasks}</p>
        </div>
      </div>

      <h1 className="hr-title">Recent Activities</h1>
      <div className="recent-activities">
        <div className="recent-section">
          <h3>👥 Recently Added Employees</h3>
          {recentEmployees.length === 0 ? (
            <p>No recent employees added.</p>
          ) : (
            <ul>
              {recentEmployees.map(emp => (
                <li key={emp._id}>{emp.name} (ID: {emp.employeeId})</li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="recent-section">
          <h3>💰 Recent Payrolls</h3>
          {recentPayrolls.length === 0 ? (
            <p>No recent payroll activities.</p>
          ) : (
            <ul>
              {recentPayrolls.map(pay => (
                <li key={pay._id}>ID: {pay.employeeId} | Salary: Rs.{pay.salary}</li>
              ))}
            </ul>
          )}
        </div>

 
        <div className="recent-section">
          <h3>🧠 Recently Assigned Tasks</h3>
          {recentTasks.length === 0 ? (
            <p>No recent task assignments.</p>
          ) : (
            <ul>
              {recentTasks.map(task => (
                <li key={task._id}>
                  {task.title} (To: {task.assignedTo?.name || 'Unknown'})
                </li>
              ))}
            </ul>
          )}
        </div>
        
 <div className="recent-activities">
        <div className="recent-section">
        <h3>⏰ Task Reminders (Due Soon)</h3>
        {dueSoonTasks.length === 0 ? (
          <p>No upcoming deadlines in the next 24 hours.</p>
        ) : (
          <ul>
            {dueSoonTasks.map(task => (
              <li key={task._id}>
                {task.title} (To: {task.assignedTo?.name || 'Unknown'}) - Due: {new Date(task.deadline).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
      

      </div>

      

      
    </div>
  );
};

export default HRDashboard;