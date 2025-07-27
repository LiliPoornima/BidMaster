const express = require("express");
const router = express.Router();
const ShipperController = require("../Controlers/ShipperController");

router.post("/add", ShipperController.addCourier);
router.get("/all", ShipperController.getAllCouriers);
router.put("/update/:id", ShipperController.updateCourier);
router.delete("/delete/:id", ShipperController.deleteCourier);
router.get("/dashboard/stats", ShipperController.getDashboardStats);


module.exports = router;
