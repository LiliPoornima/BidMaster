const Payroll = require("../Model/PayrollModel");
const Employee = require("../Model/EmpModel");

const addPayroll = async (req, res) => {
  try {
    const { employeeId, salary, commission = 0, month, status } = req.body;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    let finalCommission = parseFloat(commission);

    // Optionally calculate commission dynamically if needed
    if (employee.role === 'Sales Executive' && !commission) {
      // You can set a default or dynamic value for sales executives
      finalCommission = calculateCommission(employee.salesAmount); // Define this function or use a default
    }

    const parsedSalary = parseFloat(salary);
    const totalEarnings = parsedSalary + finalCommission;
    const deductions = totalEarnings * 0.05;
    const netPay = totalEarnings - deductions;

    const payroll = new Payroll({
      employeeId,
      employeeName: employee.name,
      role: employee.role,
      salary: parsedSalary,
      commission: finalCommission,
      totalEarnings,
      deductions,
      netPay,
      month,
      status
    });

    await payroll.save();
    res.status(201).json({ message: "Payroll added", payroll });
  } catch (error) {
    res.status(500).json({ message: "Error adding payroll", error });
  }
};


const getPayroll = async (req, res) => {
  try {
    const records = await Payroll.find();
    res.json({ payrollRecords: records });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
};

const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await Payroll.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Payroll record not found" });
    }
    res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payroll record", error });
  }
};


const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, salary, commission = 0, month, status } = req.body;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const totalEarnings = parseFloat(salary) + parseFloat(commission);
    const deductions = totalEarnings * 0.05;
    const netPay = totalEarnings - deductions;

    const updatedPayroll = await Payroll.findByIdAndUpdate(
      id,
      {
        employeeId,
        employeeName: employee.name,
        role: employee.role,
        salary,
        deductions,
        commission,
        totalEarnings,
        netPay,
        month,
        status,
      },
      { new: true }
    );

    if (!updatedPayroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    res.status(200).json({ message: "Payroll updated", payroll: updatedPayroll });
  } catch (error) {
    res.status(500).json({ message: "Error updating payroll", error });
  }
};

const getPendingPayrollCount = async (req, res) => {
  try {
    const count = await Payroll.countDocuments({ status: 'Pending' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending payroll count' });
  }
};


module.exports = { addPayroll, getPayroll ,deletePayroll,updatePayroll,getPendingPayrollCount};
