import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './NotificationBell.css';

const NotificationBell = ({ username }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!username) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${username}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [username]);

  const markAllAsRead = useCallback(async () => {
    if (!username) return;
    try {
      await axios.put(`http://localhost:5000/api/notifications/mark-read/${username}`);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  }, [username]);

  const handleBellClick = async () => {
    if (!showDropdown) {
      await markAllAsRead();
      await fetchNotifications(); // only fetch when opening
    }
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    fetchNotifications(); // initial fetch
  }, [fetchNotifications]);

  const handleDismiss = (notificationId) => {
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-bell">
      <div className="icon-wrapper" onClick={handleBellClick}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>
      {showDropdown && (
        <div className="dropdown">
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className={`notification-item ${n.read ? '' : 'unread'}`}>
                <span>{n.message}</span>
                <button className="close-btn" onClick={() => handleDismiss(n._id)}>✖</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
