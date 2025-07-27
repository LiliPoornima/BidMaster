const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String },
  role: { type: String },
  salary: { type: Number },
  commission: { type: Number, default: 0 },
  totalEarnings: { type: Number },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number },
  month: { type: String },
  status: { type: String, default: "Pending" }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model("PayrollModel", payrollSchema);
