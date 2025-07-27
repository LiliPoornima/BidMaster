import React, { createContext, useContext, useState } from 'react';

const BidNotificationContext = createContext();

export const useBidNotification = () => useContext(BidNotificationContext);

export const BidNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notif) => setNotifications((prev) => [notif, ...prev]);
  const markAllRead = () => setNotifications((prev) => prev.map(n => ({ ...n, read: true })));

  return (
    <BidNotificationContext.Provider value={{ notifications, addNotification, markAllRead }}>
      {children}
    </BidNotificationContext.Provider>
  );
};
