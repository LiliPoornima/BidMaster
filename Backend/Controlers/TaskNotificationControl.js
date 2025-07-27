const Notification = require("../Model/TaskNotificationModel");

// Create a new notification
const createNotification = async (req, res) => {
  const { message, username } = req.body;

  if (!message || !username) {
    return res.status(400).json({ success: false, message: "Message and username are required" });
  }

  try {
    const newNotification = new Notification({ message, username });
    await newNotification.save();
    return res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    console.error("Error creating notification:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get notifications for a user by username
const getNotificationsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const notifications = await Notification.find({ username }).sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Optional: Mark all notifications as read
const markAllAsRead = async (req, res) => {
  const { username } = req.params;

  try {
    await Notification.updateMany({ username, read: false }, { $set: { read: true } });
    return res.status(200).json({ success: true, message: "All marked as read" });
  } catch (err) {
    console.error("Error marking as read:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUsername,
  markAllAsRead
};
