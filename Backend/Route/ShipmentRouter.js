const express = require("express");
const router = express.Router();
const ShipmentController = require("../Controlers/ShipmentController");

router.post("/create", ShipmentController.createShipment);
router.get("/all", ShipmentController.getAllShipments);
router.get("/user/:email", ShipmentController.getUserShipments);
router.get("/:id", ShipmentController.getShipmentById);
router.put("/status/:id", ShipmentController.updateShipmentStatus);
router.delete("/delete/:id", ShipmentController.deleteShipment);
router.put("/assign/:id", ShipmentController.assignCourier);
router.put('/update/:id', ShipmentController.updateShipment);
router.get('/user/:email',ShipmentController.getShipmentsByUserEmail);

module.exports = router;
