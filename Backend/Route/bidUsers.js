const express = require("express");
const router = express.Router();
const multer = require("multer");
const bidUserController = require("../Controlers/BidUserControllers");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Routes
router.get("/", bidUserController.getAllBidUsers);
router.post("/", upload.single("picture"), bidUserController.createBidUsers);
router.get("/:id", bidUserController.getBidUserById); // Updated to use controller method
router.put("/:id", upload.single("picture"), bidUserController.updateBidUser);
router.delete("/:id", bidUserController.deleteBidUser);

module.exports = router;