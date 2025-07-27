const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");


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



const {
  updateSellerProfile,
  getSellerProfile,
} = require('../Controlers/SellerProfileController');

// ✅ Update/Create profile
router.put('/profile/update', upload.single('profilePicture'), updateSellerProfile);



module.exports = router;
