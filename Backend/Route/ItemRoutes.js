const express = require("express");
const router = express.Router();
const {
  getAllItems,
  getItemById,
  getItemsBySeller,
  addItem,
  updateItem,
  deleteItem,
  deleteItemBySeller,
  updateItemStatus,
  
} = require("../Controlers/ItemControllers");
const upload = require("../upload");

// Routes
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.get("/seller/:username", getItemsBySeller);

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  addItem
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  updateItem
);

router.delete("/:id", deleteItem);
router.patch("/:id", updateItemStatus);
router.patch("/seller-delete/:id", deleteItemBySeller); // New route for seller delete


module.exports = router;
