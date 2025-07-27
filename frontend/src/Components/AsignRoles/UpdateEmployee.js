import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import './AddEmployee.css'; // Reusing AddEmployee.css for consistency

function UpdateEmployee() {
  const [inputs, setInputs] = useState(null);
  const navigate = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
        if (response.data && response.data.employee) {
          setInputs(response.data.employee);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchHandler();
  }, [id]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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

    const updatedSkills = Array.isArray(inputs.skills)
      ? inputs.skills
      : inputs.skills.split(',').map(skill => skill.trim()).filter(Boolean);

    try {
      await axios.put(`http://localhost:5000/api/employees/${id}`, {
        ...inputs,
        skills: updatedSkills,
      });

      alert("Employee updated successfully!");
      navigate("/employeeDashboard", { state: { refresh: true } });
    } catch (error) {
      console.error('Error updating employee data:', error);
      alert("Failed to update employee. Please try again.");
    }
  };

  if (!inputs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="addEmp-container">
      <div className="addEmp-box">
        {/* Left side image and content */}
        <div className="addEmp-image-container">
          <div className="addEmp-image"></div>
          <div className="addEmp-image-content">
            <h3>Team Management</h3>
            <p>Update your team details to keep employee records accurate and up to date.</p>
          </div>
        </div>

        {/* Form container */}
        <div className="addEmp-form-container">
          <div className="updateEmp-header">
            <button onClick={() => navigate(-1)} className="go-back-button">
              <IoIosArrowBack />
            </button>
          </div>

          <h2 className="addEmp-header">Update Employee</h2>
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
                  readOnly
                />
              </div>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
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
                required
              />
            </div>

            {/* Row 4: Address */}
            <div>
              <label>Address</label>
              <textarea
                name="address"
                value={inputs.address}
                onChange={handleChange}
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
                  value={Array.isArray(inputs.skills) ? inputs.skills.join(', ') : inputs.skills}
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
                required
              />
            </div>

            <button type="submit" className="addEmp-button">Update Employee</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateEmployee;
