import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskNotification = ({ employeeId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${employeeId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    fetchNotifications();
  }, [employeeId]);

  return (
    <div className="notifications">
      <h4>Notifications</h4>
      <ul>
        {notifications.map((note) => (
          <li key={note._id}>{note.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskNotification;
