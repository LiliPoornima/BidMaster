import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2"; // Import Line chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js"; // Add PointElement

import "./EmployeeDashboard.css";

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement); // Register PointElement

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 4; // Maximum employees per page
  const navigate = useNavigate();
  const pdfRef = useRef(); // Reference for capturing content

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Apply the search filter across all employees
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Calculate the employees to display based on the current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const deleteHandler = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Function to download PDF using html2canvas & jsPDF
  const downloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 size width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("Employee_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Calculate employee count by department
  const departmentCounts = employees.reduce((acc, employee) => {
    const { department } = employee;
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the Pie chart
  const pieChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        data: Object.values(departmentCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40", "#9966FF"],
        hoverOffset: 4,
      },
    ],
  };

  // Prepare data for the Line chart (Employee Salary)
  const salaryChartData = {
    labels: employees.map((employee) => employee.name), // X-axis is the employee names
    datasets: [
      {
        label: "Employee Salary",
        data: employees.map((employee) => employee.salary), // Y-axis is the salary data
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div>
    
      <div className="empDashboard-container">
        <div className="empDashboard">
          <h2>Employee Management Dashboard</h2>
        </div>
       
        <div className="empDashboard-controls">
          <div className="empDashboard-search">
            <input
              type="text"
              placeholder="Search Employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="downloadEmp-btn" onClick={downloadPDF}>
            Download PDF
          </button>

          <button className="add-employee-btn" onClick={() => navigate("/addEmployee")}>
            Add
          </button>
        </div>

        {/* Employee Table Section for PDF */}
        <div className="empDashboard-table" ref={pdfRef}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>EmployeeId</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{index + 1 + (currentPage - 1) * employeesPerPage}</td>
                    <Link to={`/employeeDetails/${emp._id}`}>
                    <td>{emp.employeeId}</td>
                    </Link>
                   
                    <td>{emp.name} </td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                 
                    <td>{emp.salary}</td>
               
                    <td>{emp.department}</td>
                   
                    <td>
                      <Link to={`/employeeDashboard/${emp._id}`}>
                        <button className="empUpdate-btn">✏️</button>
                      </Link>
                      <button onClick={() => deleteHandler(emp._id)} className="empDelete-btn">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-employees">
                  <td colSpan="10">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {/* Pie Chart and Department Details Section */}
          <div className="pie-chart-and-details">
            {/* Pie Chart */}
            <div className="pie-chart-card">
              <h3>Employee Count by Department</h3>
              <Pie data={pieChartData} />
            </div>

            {/* Line Chart (Salary chart) */}
            <div className="line-chart-card">
              <h3>Employee Salary Overview</h3>
              <Line data={salaryChartData} />
            </div>

            {/* Department Details */}
            <div className="department-details-card">
            <h3>Department Overview</h3>
              <ul>
                {Object.entries(departmentCounts).map(([department,count]) => (
                  <li key={department}>
                    <strong>{department}</strong>: {count}{" "}
                    {count > 1 ? "employees" : "employee"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
