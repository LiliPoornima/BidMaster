// BidShipProfile.js - Enhanced with modern UI while maintaining functionality
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './BidShipProfile.css';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaGlobe,
  FaMapPin,
  FaSave,
  FaTimes,
  FaHistory,
  FaInfoCircle,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';

const BidShipProfile = () => {
  // Keeping the same state management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    age: '',
    mobileNo: '',
    shippingAddress: '',
    postalCode: '',
    country: ''
  });
  const [validation, setValidation] = useState({
    email: { isValid: true, message: '' },
    mobileNo: { isValid: true, message: '' }
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Same effect to populate the form when editing
  useEffect(() => {
    if (location.state?.editDetail) {
      const { _id, fullname, email, age, mobileNo, shippingAddress, postalCode, country } = location.state.editDetail;
      setFormData({ fullname, email, age, mobileNo, shippingAddress, postalCode, country });
      setEditingId(_id);
    }
  }, [location.state]);

  // Validate email function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate mobile number function
  const validateMobileNo = (mobileNo) => {
    const mobileNoString = mobileNo.toString();
    return mobileNoString.length === 10 && !isNaN(mobileNo);
  };

  // Modified handler for input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle different field types
    let processedValue = value;
    if (name === 'age' || name === 'mobileNo') {
      processedValue = value === '' ? '' : parseInt(value, 10);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    // Validate email
    if (name === 'email') {
      const isValid = validateEmail(value);
      setValidation({
        ...validation,
        email: {
          isValid,
          message: isValid ? '' : 'Please enter a valid email address'
        }
      });
    }
    
    // Validate mobile number
    if (name === 'mobileNo') {
      // Allow empty string during typing
      if (value === '') {
        setValidation({
          ...validation,
          mobileNo: { isValid: true, message: '' }
        });
      } else {
        const valueStr = value.toString();
        const isValid = valueStr.length === 10 && !isNaN(value);
        setValidation({
          ...validation,
          mobileNo: {
            isValid,
            message: isValid ? '' : 'Mobile number must be exactly 10 digits'
          }
        });
      }
    }
  };

  // Modified submit handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submitting
    const isEmailValid = validateEmail(formData.email);
    const isMobileNoValid = validateMobileNo(formData.mobileNo);
    
    setValidation({
      email: {
        isValid: isEmailValid,
        message: isEmailValid ? '' : 'Please enter a valid email address'
      },
      mobileNo: {
        isValid: isMobileNoValid,
        message: isMobileNoValid ? '' : 'Mobile number must be exactly 10 digits'
      }
    });
    
    // Only proceed if all validations pass
    if (!isEmailValid || !isMobileNoValid) {
      return;
    }
    
    const confirmSubmit = window.confirm('Are you sure you want to submit your shipping details?');
    if (confirmSubmit) {
      setLoading(true);
      try {
        if (editingId) {
          await axios.put(`http://localhost:5000/bid-ship-users/${editingId}`, formData);
        } else {
          await axios.post(`http://localhost:5000/bid-ship-users`, formData);
        }
        setFormData({ fullname: '', email: '', age: '', mobileNo: '', shippingAddress: '', postalCode: '', country: '' });
        setEditingId(null);
        alert('Submission was successful!');
      } catch (err) {
        setError('Failed to save shipping details.');
        console.error('Error saving details:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Same cancel handler
  const cancelEdit = () => {
    setFormData({ fullname: '', email: '', age: '', mobileNo: '', shippingAddress: '', postalCode: '', country: '' });
    setEditingId(null);
    // Reset validation states
    setValidation({
      email: { isValid: true, message: '' },
      mobileNo: { isValid: true, message: '' }
    });
  };

  // Same handler to view previous details
  const handlePreviousDetails = () => {
    navigate('/bid-ship-users-details');
  };

  if (loading) {
    return <div className="bidshipprofile-loading">Loading...</div>;
  }

  return (
    <div className="bidshipprofile-container">
      <div className="bidshipprofile-background-wrapper"></div>
      <h1 className="bidshipprofile-h1">Bidder Shipping Profile</h1>
      
      {/* Progress steps - visual enhancement */}
      <div className="bidshipprofile-progress-steps">
        <div className="bidshipprofile-step completed">
          <div className="bidshipprofile-step-number"><FaCheck /></div>
          <div className="bidshipprofile-step-label">Login</div>
        </div>
        <div className="bidshipprofile-step active">
          <div className="bidshipprofile-step-number">2</div>
          <div className="bidshipprofile-step-label">Shipping Info</div>
        </div>
        <div className="bidshipprofile-step">
          <div className="bidshipprofile-step-number">3</div>
          <div className="bidshipprofile-step-label">Confirmation</div>
        </div>
      </div>
      
      {error && <div className="bidshipprofile-error-message">{error}</div>}
      
      <div className="bidshipprofile-form-container">
        <h2 className="bidshipprofile-h2">{editingId ? 'Update Shipping Details' : 'Submit Shipping Details'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="bidshipprofile-form-grid">
            {/* Personal Information */}
            <div className="bidshipprofile-form-group">
              <label htmlFor="fullname" className="bidshipprofile-label">
                <FaUser /> Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                className="bidshipprofile-input"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="bidshipprofile-form-group">
              <label htmlFor="email" className="bidshipprofile-label">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`bidshipprofile-input ${!validation.email.isValid ? 'bidshipprofile-input-error' : ''}`}
                placeholder="Enter your email address"
              />
              {!validation.email.isValid && (
                <div className="bidshipprofile-validation-message">
                  <FaExclamationTriangle /> {validation.email.message}
                </div>
              )}
            </div>
            
            <div className="bidshipprofile-form-group">
              <label htmlFor="age" className="bidshipprofile-label">
                <FaCalendarAlt /> Age
                <span className="bidshipprofile-tooltip">
                  <FaInfoCircle className="bidshipprofile-tooltip-icon" />
                  <span className="bidshipprofile-tooltip-text">You must be at least 18 years old to proceed.</span>
                </span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="18"
                className="bidshipprofile-input"
                placeholder="Enter your age"
              />
            </div>
            
            <div className="bidshipprofile-form-group">
              <label htmlFor="mobileNo" className="bidshipprofile-label">
                <FaPhone /> Mobile Number
              </label>
              <input
                type="tel"
                id="mobileNo"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                required
                className={`bidshipprofile-input ${!validation.mobileNo.isValid ? 'bidshipprofile-input-error' : ''}`}
                placeholder="Enter your 10-digit mobile number"
                maxLength="10"
                pattern="[0-9]{10}"
              />
              {!validation.mobileNo.isValid && (
                <div className="bidshipprofile-validation-message">
                  <FaExclamationTriangle /> {validation.mobileNo.message}
                </div>
              )}
            </div>
            
            {/* Address Information */}
            <div className="bidshipprofile-form-group full-width">
              <label htmlFor="shippingAddress" className="bidshipprofile-label">
                <FaMapMarkerAlt /> Shipping Address
              </label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                required
                className="bidshipprofile-textarea"
                placeholder="Enter your complete shipping address"
              />
            </div>
            
            <div className="bidshipprofile-form-group">
              <label htmlFor="postalCode" className="bidshipprofile-label">
                <FaMapPin /> Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="bidshipprofile-input"
                placeholder="Enter postal/zip code"
              />
            </div>
            
            <div className="bidshipprofile-form-group">
              <label htmlFor="country" className="bidshipprofile-label">
                <FaGlobe /> Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="bidshipprofile-input"
                placeholder="Enter your country"
              />
            </div>
          </div>
          
          {/* Action Buttons - same functionality with icons */}
          <div className="bidshipprofile-button-group">
            <button 
              type="submit" 
              className="bidshipprofile-btn-save"
              disabled={!validation.email.isValid || !validation.mobileNo.isValid}
            >
              <FaSave /> {editingId ? 'Update' : 'Submit'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                className="bidshipprofile-btn-cancel" 
                onClick={cancelEdit}
              >
                <FaTimes /> Cancel
              </button>
            )}
            
            <button 
              type="button" 
              className="bidshipprofile-btn-previous" 
              onClick={handlePreviousDetails}
            >
              <FaHistory /> Previous Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidShipProfile;