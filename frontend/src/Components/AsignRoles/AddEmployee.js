import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";
import { IoIosArrowBack } from 'react-icons/io'; 

const AddEmployee = () => {
  const navigate = useNavigate();
  const [inputs, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    salary: "",
    role: "",
    department: "",
    task: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...inputs, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(inputs.phone)) {
      alert("Please enter a valid 10-digit phone number without characters.");
      return;
    }

    if (!validateEmail(inputs.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const payload = {
      ...inputs,
      skills: inputs.skills.split(',').map(skill => skill.trim()).filter(Boolean), // Convert to array
    };

    try {
      const response = await fetch("http://localhost:5000/api/employees/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Employee added successfully!");
        setFormData({ employeeId: "", name: "", email: "", username: "", phone: "", address: "", salary: "", role: "", department: "", task: "", skills: "" });
        navigate("/employeeDashboard", { state: { refresh: true } });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Failed to add employee. Please try again.");
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="addEmp-container">
      <div className="addEmp-box">
        {/* Left side image with content */}
        <div className="addEmp-image-container">
          <div className="addEmp-image"></div>
          <div className="addEmp-image-content">
            <h3>Team Management</h3>
            <p>Add new talent to your auction team with all the details needed for seamless onboarding.</p>
          </div>
        </div>

        {/* Form container */}
        <div className="addEmp-form-container">
          <div className="updateEmp-header">
            <button onClick={() => navigate(-1)} className="go-back-button">
              <IoIosArrowBack /> 
            </button>
          </div>

          <h2 className="addEmp-header">Add Employee</h2>
          <form onSubmit={handleSubmit} className="addEmp-form">
            {/* Row 1: Employee ID and Name */}
            <div className="input-row">
              <div>
                <label>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={inputs.employeeId}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  required
                />
              </div>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email and Username */}
            <div className="input-row">
              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  placeholder="example@company.com"
                  required
                />
              </div>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={inputs.username}
                  onChange={handleChange}
                  placeholder="Create a username"
                  required
                />
              </div>
            </div>

            {/* Row 3: Phone Number */}
            <div>
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={inputs.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
              />
            </div>

            {/* Row 4: Address (full width) */}
            <div>
              <label>Address</label>
              <textarea
                name="address"
                value={inputs.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                required
              ></textarea>
            </div>

            {/* Row 5: Salary and Role */}
            <div className="input-row">
              <div>
                <label>Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={inputs.salary}
                  onChange={handleChange}
                  placeholder="Enter salary amount"
                  required
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  name="role"
                  value={inputs.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Auctioneer">Auctioneer</option>
                  <option value="Auction Coordinator">Auction Coordinator</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Item Inspector">Item Inspector</option>
                  <option value="Shipping Manager">Shipping Manager</option>
                </select>
              </div>
            </div>

            {/* Row 6: Department and Skills */}
            <div className="input-row">
              <div>
                <label>Department</label>
                <select
                  name="department"
                  value={inputs.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Auction">Auction</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Financial & Accounting">Financial & Accounting</option>
                  <option value="IT & Technical">IT & Technical</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Shipping">Shipping</option>
                </select>
              </div>
              <div>
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={inputs.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, MongoDB, React"
                />
              </div>
            </div>

            {/* Row 7: Task */}
            <div>
              <label>Primary Task</label>
              <input
                type="text"
                name="task"
                value={inputs.task}
                onChange={handleChange}
                placeholder="Main responsibility or task"
                required
              />
            </div>

            <button type="submit" className="addEmp-button">Add Employee</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;