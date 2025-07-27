const express = require("express");
const router = express.Router();

// Import the login controller
const LoginControl = require("../Controlers/LoginControl");

// POST request to /login for user login
router.post("/login", LoginControl.loginUser);

module.exports = router;
