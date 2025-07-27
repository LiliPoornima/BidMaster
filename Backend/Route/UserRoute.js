const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

//insert model
//const User = require("../Model/UserModel");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Specify the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate unique filename
  },
});
const upload = multer({ storage });
//insert User control 
const UserControl = require("../Controlers/UserControl");

router.get("/",UserControl.getAllUsers);
router.post("/",UserControl.addUsers);
router.get("/:id",UserControl.getById);
router.put("/:id",UserControl.updateUser);
router.delete("/:id",UserControl.deleteUser);
router.post("/upload/:id",upload.single("image"), UserControl.uploadProfileImage);

router.get('/profile/:username', UserControl.getUserProfile);

//export
module.exports = router;

