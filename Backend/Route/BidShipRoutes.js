const express = require("express");
const router = express.Router();
const bidShipUserController = require("../Controlers/BidShipUserControllers");

router.get("/", bidShipUserController.getAllBidShipUsers);
router.post("/", bidShipUserController.createBidShipUsers);
router.get("/:id", bidShipUserController.getBidShipUserById);
router.put("/:id", bidShipUserController.updateBidShipUser);
router.delete("/:id", bidShipUserController.deleteBidShipUser);

module.exports = router;