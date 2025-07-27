const express = require("express");
const router = express.Router();
const Payroll = require("../Model/PayrollModel");

const { addPayroll, getPayroll,deletePayroll,updatePayroll,getPendingPayrollCount } = require("../Controlers/PayrollControl");

router.post("/", addPayroll);
router.get("/", getPayroll);
router.get('/pending-count', getPendingPayrollCount);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

router.get('/recent', async (req, res) => {
  const recent = await Payroll.find().sort({ createdAt: -1 }).limit(3);
  res.json(recent);
});


module.exports = router;
