// EditBidderProfile.js - Enhanced with modern UI while maintaining functionality
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './EditBidderProfile.css';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaVenusMars,
  FaUserTag,
  FaLock,
  FaCamera,
  FaSave,
  FaTrash,
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa';

const EditBidderProfile = () => {
  // Initialize state - maintaining original functionality
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    username: '',
    password: '',
    picture: null,
  });
  const [editingId, setEditingId] = useState(null); // ID for existing profile (if editing)
  const [validation, setValidation] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  // Populate form if editing - same as original
  useEffect(() => {
    if (location.state?.editDetail) {
      const { _id, name, email, age, gender, address, phone, username, picture } = location.state.editDetail;
      setFormData({
        name: name || '',
        email: email || '',
        age: age || '',
        gender: gender || '',
        address: address || '',
        phone: phone || '',
        username: username || '',
        password: '',
        picture: null,
      });
      setEditingId(_id);
      if (picture) setProfilePic(`http://localhost:5000/${picture}`);
    }
  }, [location.state]);

  // Handle input value change - maintaining original functionality
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? (value === '' ? '' : parseInt(value, 10)) : value,
    });
    
    // Clear validation errors when field is edited
    if (validation[name]) {
      setValidation({ ...validation, [name]: null });
    }
  };

  // Handle file input for profile picture - maintaining original functionality
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
      setProfilePic(URL.createObjectURL(file)); // Preview image
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (formData.age !== '' && (formData.age < 18 || formData.age > 120)) {
      errors.age = "Age must be between 18 and 120";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Phone number should be 10 digits";
    }
    
    if (!formData.username.trim()) errors.username = "Username is required";
    
    if (!editingId && !formData.password.trim()) {
      errors.password = "Password is required for new profiles";
    } else if (!editingId && formData.password.length < 8) {
      errors.password = "Password should be at least 8 characters";
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission for create/update - maintaining original functionality with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-text');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const confirmUpdate = window.confirm(`Are you sure you want to ${editingId ? 'update' : 'create'} your profile?`);
    if (confirmUpdate) {
      setLoading(true);
      try {
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== '') {
            submissionData.append(key, formData[key]);
          }
        });

        const url = editingId
          ? `http://localhost:5000/bid-users/${editingId}` // Update profile
          : `http://localhost:5000/bid-users`; // Create new profile
        const method = editingId ? axios.put : axios.post;

        const response = await method(url, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        setSuccess(`Profile ${editingId ? 'updated' : 'created'} successfully!`);
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          navigate('/bidder-profile', { 
            state: { 
              justUpdated: true,
              profileId: response.data._id || editingId
            } 
          });
        }, 1500);
      } catch (err) {
        setError(`Failed to ${editingId ? 'update' : 'create'} profile. ${err.response?.data?.message || err.message}`);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle profile delete - maintaining original functionality
  const handleDelete = async () => {
    if (!editingId) return;
    const confirmDelete = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (confirmDelete) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/bid-users/${editingId}`);
        setSuccess('Profile deleted successfully!');
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          navigate('/bidder-profile', { state: { justDeleted: true } });
        }, 1500);
      } catch (err) {
        setError(`Failed to delete profile. ${err.response?.data?.message || err.message}`);
        console.error('Error deleting profile:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="editbidprofile-edit-bidder-profile-container">
      <h1>{editingId ? 'Edit Profile' : 'Create Profile'}</h1>

      {/* Success message */}
      {success && <div className="editbidprofile-success-message">{success}</div>}
      
      {/* Error message */}
      {error && <div className="editbidprofile-error-message">{error}</div>}

      {/* Loading overlay */}
      {loading && <div className="editbidprofile-loading-overlay">Processing...</div>}

      <div className="editbidprofile-form-container">
        {/* Profile picture section */}
        <div className="editbidprofile-profile-pic-section">
          {profilePic ? (
            <img src={profilePic} alt="Profile Preview" className="editbidprofile-profile-pic" />
          ) : (
            <div className="editbidprofile-pic-placeholder">
              <FaUser size={60} />
            </div>
          )}
          <input
            type="file"
            id="picture"
            name="picture"
            accept="image/*"
            onChange={handleFileChange}
            className="editbidprofile-file-input"
          />
          <label htmlFor="picture" className="editbidprofile-file-label">
            <FaCamera /> {profilePic ? 'Change Picture' : 'Upload Picture'}
          </label>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="editbidprofile-profile-form">
          <div className="editbidprofile-form-grid">
            <div className="editbidprofile-section-header">Personal Information</div>
            
            {/* Form fields with icons and validation */}
            <div className="editbidprofile-form-group">
              <label htmlFor="name" className="editbidprofile-required">
                <FaUser /> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              {validation.name && <div className="error-text">{validation.name}</div>}
            </div>
            
            <div className="editbidprofile-form-group">
              <label htmlFor="email" className="editbidprofile-required">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
              {validation.email && <div className="error-text">{validation.email}</div>}
            </div>
            
            <div className="editbidprofile-form-group">
              <label htmlFor="age" className="editbidprofile-required">
                <FaCalendarAlt /> Age
                <span className="editbidprofile-tooltip">
                  <FaInfoCircle className="editbidprofile-tooltip-icon" />
                  <span className="editbidprofile-tooltip-text">You must be at least 18 years old to register.</span>
                </span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter your age"
                min="18"
                max="120"
              />
              {validation.age && <div className="error-text">{validation.age}</div>}
            </div>
            
            <div className="editbidprofile-form-group">
              <label htmlFor="gender" className="editbidprofile-required">
                <FaVenusMars /> Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {validation.gender && <div className="error-text">{validation.gender}</div>}
            </div>
            
            <div className="editbidprofile-form-group full-width">
              <label htmlFor="address" className="editbidprofile-required">
                <FaMapMarkerAlt /> Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
              />
              {validation.address && <div className="error-text">{validation.address}</div>}
            </div>
            
            <div className="editbidprofile-section-header">Contact & Account Details</div>
            
            <div className="editbidprofile-form-group">
              <label htmlFor="phone" className="editbidprofile-required">
                <FaPhone /> Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {validation.phone && <div className="error-text">{validation.phone}</div>}
            </div>
            
            <div className="editbidprofile-form-group">
              <label htmlFor="username" className="editbidprofile-required">
                <FaUserTag /> Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
              />
              {validation.username && <div className="error-text">{validation.username}</div>}
            </div>
            
            <div className="editbidprofile-form-group">
              <label htmlFor="password" className={!editingId ? 'editbidprofile-required' : ''}>
                <FaLock /> Password
                {editingId && <span className="editbidprofile-tooltip">
                  <FaInfoCircle className="editbidprofile-tooltip-icon" />
                  <span className="editbidprofile-tooltip-text">Leave blank to keep current password.</span>
                </span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={editingId ? "Leave blank to keep current password" : "Create a strong password"}
              />
              {validation.password && <div className="error-text">{validation.password}</div>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="editbidprofile-button-group">
            <button type="submit" className="editbidprofile-btn-save" disabled={loading}>
              <FaSave /> {editingId ? 'Update Profile' : 'Create Profile'}
            </button>
            {editingId && (
              <button
                type="button"
                className="editbidprofile-btn-delete"
                onClick={handleDelete}
                disabled={loading}
              >
                <FaTrash /> Delete Profile
              </button>
            )}
            <button
              type="button"
              className="editbidprofile-btn-cancel"
              onClick={() => navigate('/bidder-profile')}
              disabled={loading}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBidderProfile;