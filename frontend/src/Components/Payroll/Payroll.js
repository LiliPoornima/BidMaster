import React, { useEffect, useState, useRef } from "react";
import "./Payroll.css";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from "recharts";



const PayrollDashboard = () => {
  const [form, setForm] = useState({
    employeeId: "",
    salary: "",
    commission: "",
    month: "",
    status: "Pending",
    
  });

  //search bar
  const [searchMonth, setSearchMonth] = useState("");
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);

  //line graph
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  //pie chart
  const selectedEmployeeData = payrollRecords
  .filter((record) => record.employeeId === selectedEmployeeId)
  .sort((a, b) => new Date(b.month) - new Date(a.month))[0]; // Get most recent

const pieChartData = selectedEmployeeData
  ? [
      { name: "Basic Salary", value: parseFloat(selectedEmployeeData.salary) || 0 },
      { name: "Commission", value: parseFloat(selectedEmployeeData.commission) || 0 },
      { name: "Deductions", value: parseFloat(selectedEmployeeData.deductions) || 0 },
    ]
  : [];



  const tableRef = useRef(); // Reference only for the table

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    const res = await fetch("http://localhost:5000/api/payroll");
    const data = await res.json();
    setPayrollRecords(data.payrollRecords || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:5000/api/payroll/${editingId}`
      : "http://localhost:5000/api/payroll";
    const method = editingId ? "PUT" : "POST";
  
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  
    const result = await res.json();
    if (res.ok) {
      alert(result.message); 
      fetchPayroll();
      setForm({ employeeId: "", salary: "", commission: "", month: "", status: "Pending" });

      setEditingId(null);
    } else {
      alert(result.message || "Failed to save payroll record.");
    }
  };

  //edit details
  const editPayroll = (record) => {
    setForm({
      employeeId: record.employeeId,
      salary: record.salary,
      commission: record.commission || "",
      month: record.month,
      status: record.status,
    });
    setEditingId(record._id);
  };
  
  
//delete details
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payroll record?")) return;

    const res = await fetch(`http://localhost:5000/api/payroll/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (res.ok) {
      alert(result.message);
      fetchPayroll();
    } else {
      alert("Failed to delete payroll record.");
    }
  };

  //pdf downloading
  const downloadTablePDF = async () => {
    const input = tableRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("Payroll_Table.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  //bar chart payroll
  const chartData = payrollRecords.map((record) => ({
    name: record.employeeName,
   
    NetPay: parseFloat(record.netPay),
    Deductions: parseFloat(record.deductions),
    Commission: parseFloat(record.commission || 0),
  }));

  //page splitting
  const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 8; // or any number you prefer

//filter month
const filteredRecords = payrollRecords.filter(record =>
  record.month.toLowerCase().includes(searchMonth.toLowerCase())
);

const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

//line graph
const lineChartData = payrollRecords
  .filter((record) => record.employeeId === selectedEmployeeId)
  .sort((a, b) => new Date(`01 ${a.month}`) - new Date(`01 ${b.month}`)) // to sort by month
  .map((record) => ({
    month: record.month,
    NetPay: parseFloat(record.netPay),
  }));

  

  return (
    <div className="payroll-container">
      <h2>Add Payroll</h2>
      <form onSubmit={handleSubmit} className="payroll-form">
        <input
          name="employeeId"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={handleChange}
          required
        />
        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <input
          name="commission"
          type="number"
          placeholder="Commission"
          value={form.commission}
          onChange={handleChange}
        />

        <input
          name="month"
          placeholder="Month"
          value={form.month}
          onChange={handleChange}
          required
        />
        

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
        <button type="submit">
  {editingId ? "Update Payroll" : "Add Payroll"}
</button>

      </form>

    
     
      <div ref={tableRef}>
      <div className="payroll-header">
  <div className="payroll-search-bar">
    <input
      type="text"
      placeholder="Search by Month (e.g., April)"
      value={searchMonth}
      onChange={(e) => setSearchMonth(e.target.value)}
    />
  </div>
  <h2>Payroll Records</h2>
  <button className="download-pdf-btn" onClick={downloadTablePDF}>
    Download Table PDF
  </button>
</div>

      
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Deductions</th>
              <th>Commission</th>
              <th>Total Earnings</th>
              <th>Net Pay</th>
              <th>Month</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {currentRecords.length ? (
    currentRecords.map((record) => (
      <tr key={record._id}>
        <td>{record.employeeId}</td>
        <td>{record.employeeName}</td>
        <td>{record.role}</td>
        <td>{parseFloat(record.salary).toFixed(2)}</td>
        <td>{parseFloat(record.deductions).toFixed(2)}</td>
        <td>{parseFloat(record.commission || 0).toFixed(2)}</td>
        <td>{parseFloat(record.totalEarnings).toFixed(2)}</td>
        <td>{parseFloat(record.netPay).toFixed(2)}</td>
        <td>{record.month}</td>
        <td className={record.status === "Paid" ? "status-paid" : "payroll-status-pending"}>
          {record.status}
        </td>
        <td>
          <button onClick={() => editPayroll(record)} className="edit-btn">Update</button>
          <button onClick={() => handleDelete(record._id)} className="delete-btn">Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="11">No payroll records found</td>
    </tr>
  )}
</tbody>

        </table>

        <div className="pagination">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    Prev
  </button>
  <span>Page {currentPage} of {totalPages}</span>
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

    
        <div className="payroll-chart-card">
  <h3>Payroll Breakdown (Bar Chart)</h3>
  <div style={{ width: "100%", height: 350 }}>
    <ResponsiveContainer>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
       
        <Bar dataKey="Commission" fill="#ffc658" />
        <Bar dataKey="Deductions" fill="#ff7f7f" />
        <Bar dataKey="NetPay" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>



<div className="line-chart-selector">
  <label>Select Employee ID: </label>
  <select
    value={selectedEmployeeId}
    onChange={(e) => setSelectedEmployeeId(e.target.value)}
  >
    <option value="">-- Select Employee --</option>
    {[...new Set(payrollRecords.map((r) => r.employeeId))].map((id) => (
      <option key={id} value={id}>
        {id}
      </option>
    ))}
  </select>
</div>


{selectedEmployeeId && (
  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
    {/* Line Chart */}
    <div style={{ flex: "1 1 48%" }}>
      <h3>Net Pay Over Months - {selectedEmployeeId}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="NetPay" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Pie Chart */}
    <div style={{ flex: "1 1 48%", textAlign: "left"  ,marginLeft: "30px"}}>
      <h4>Payroll Breakdown</h4>
      <PieChart width={300} height={300}>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {pieChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]}
            />
          ))}
        </Pie>
        <RechartsTooltip />
        <Legend />
      </PieChart>
    </div>
  </div>
)}


</div> 


    </div>
  );
};

export default PayrollDashboard;
