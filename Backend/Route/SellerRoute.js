const express = require('express');
const router = express.Router();
const SellerController = require('../Controlers/SellerController');
const multer = require('multer');
const path = require('path');

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

// Routes
router.post(
    '/',
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'additionalImages', maxCount: 4 }
    ]),
    SellerController.createItem
);

router.get('/', SellerController.getItems);
router.get('/:id', SellerController.getItemById);
router.delete('/:id', SellerController.deleteItem);
router.get('/seller/:username', SellerController.getItemsBySeller);

module.exports = router;
