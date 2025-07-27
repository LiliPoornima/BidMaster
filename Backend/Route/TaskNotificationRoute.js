const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotificationsByUsername,
  markAllAsRead
} = require("../Controlers/TaskNotificationControl");

// POST: create new notification
router.post("/", createNotification);

// GET: get notifications by username
router.get("/:username", getNotificationsByUsername);

// PUT: mark all notifications as read
router.put("/mark-read/:username", markAllAsRead);

module.exports = router;
