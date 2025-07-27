const express = require("express");
const router = express.Router();
const multer = require("multer");
const EmpControl = require("../Controlers/EmpControl");
const path = require('path');
const Employee = require("../Model/EmpModel");

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

// Routes
router.post("/add", EmpControl.addEmployee);
router.get("/", EmpControl.getAllEmployees);
router.get('/count', EmpControl.getEmployeeCount);

router.get('/recent', async (req, res) => {
  const recent = await Employee.find().sort({ createdAt: -1 }).limit(3);
  res.json(recent);
});

router.get("/:id", EmpControl.getEmployeeById); // Get employee by ID



router.put("/:id", EmpControl.updateEmployee);
router.delete("/:id", EmpControl.deleteEmpDetails);
router.get("/:id/details", EmpControl.getEmployeeById); 
router.post("/:id/upload", upload.single("image"), EmpControl.uploadImage);  // Upload image



module.exports = router;
