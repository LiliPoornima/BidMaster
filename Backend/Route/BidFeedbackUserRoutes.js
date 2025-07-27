const express = require("express");
const router = express.Router();
const bidFeedbackUserController = require("../Controlers/BidFeedbackUserControllers");

router.get("/", bidFeedbackUserController.getAllBidFeedbackUsers);
router.post("/", bidFeedbackUserController.createBidFeedbackUsers);
router.get("/:id", bidFeedbackUserController.getBidFeedbackUserById);
router.put("/:id", bidFeedbackUserController.updateBidFeedbackUser);
router.delete("/:id", bidFeedbackUserController.deleteBidFeedbackUser);

module.exports = router;