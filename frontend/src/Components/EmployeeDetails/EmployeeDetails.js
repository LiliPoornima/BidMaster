import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeDetails.css";
import { IoIosArrowBack } from 'react-icons/io'; 

const EmployeeDetails = () => {
  const { id } = useParams(); // Get employee ID from URL
  const [employee, setEmployee] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch employee details on mount
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/employees/${id}/details`);
        setEmployee(data.employee); // Set the employee details
      } catch (error) {
        setError("Error fetching employee details");
        console.error(error);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file object
    }
  };

  // Handle form submission for image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append("image", image); // Append the selected image file

      try {
        const response = await axios.post(`http://localhost:5000/api/employees/${id}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Image uploaded successfully!");
        // Refresh the employee data to include the uploaded image
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          image: response.data.employee.image,
        }));
      } catch (error) {
        alert("Error uploading image");
        console.error(error);
      }
    } else {
      alert("Please select an image to upload.");
    }
  };

  // Handle employee details rendering
  if (error) return <p>{error}</p>;
  if (!employee) return <p>Loading...</p>;

  return (
 
    <div className="employee-details-container">
    <div className="employee-details-header">
       {/* Go Back Button */}
                      <button onClick={() => navigate(-1)} className="emp-go-back-button">
                          <IoIosArrowBack /> 
                      </button>
     
      <h2>Employee Details</h2>
      <div className="employee-details">
        {/* Left side: Image and upload form */}
        <div className="image-section">
          {/* Show the uploaded image or a placeholder */}
          {employee.image ? (
            <img src={`http://localhost:5000${employee.image}`} alt="Employee" />
          ) : (
            <img
              src="https://via.placeholder.com/200"
              alt="Employee Placeholder"
            />
          )}
          {/* Image Upload Form */}
          <form onSubmit={handleImageUpload}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit">Upload Image</button>
          </form>
        </div>

        {/* Right side: Employee details */}
        <div className="details-section">
          <h3>Name: {employee.name}</h3>
          <p>Email: {employee.email}</p>
          <p>Username: {employee.username}</p>
          <p>Phone: {employee.phone}</p>
          <p>Address: {employee.address}</p>
          <p>Salary: {employee.salary}</p>
          <p>Role: {employee.role}</p>
          <p>Department: {employee.department}</p>
          <p>Task: {employee.task}</p>
          {employee.skills && employee.skills.length > 0 && (
          <p>Skills: {employee.skills.join(', ')}</p>
          )}
        </div>
      </div>

      
    </div>
    </div>
  );
};

export default EmployeeDetails;