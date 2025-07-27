const express = require("express");
const router = express.Router();
//insert Model
const Report = require("../Model/ReportModel");
//insert Report Controller
const ReportController = require("../Controlers/ReportControllers");

router.get("/",ReportController.getAllReports);
router.post("/",ReportController.addReports);
router.get("/:id",ReportController.getById);
router.put("/:id",ReportController.updateReport);
router.delete("/:id",ReportController.deleteReport);

//export
module.exports = router;