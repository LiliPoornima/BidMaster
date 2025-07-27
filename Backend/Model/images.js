const express = require("express");
const router = express.Router();
const imageController = require("../Controlers/ImageController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./Uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post("/upload-img", upload.single("image"), imageController.uploadImage);
router.get("/getImage", imageController.getImages);
router.delete("/delete-image/:id", imageController.deleteImage);

module.exports = router;