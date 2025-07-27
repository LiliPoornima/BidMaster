import React from 'react';
import '../BidShipUsers/BidShipProfile.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaMapPin } from 'react-icons/fa';

const ViewShipDetails = ({ details, onClose }) => {
  if (!details) return null;

  return (
    <div className="bidshipprofile-container" style={{ background: 'rgba(0,0,0,0.2)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bidshipprofile-form-container" style={{ background: 'white', borderRadius: '12px', padding: '2rem', minWidth: 350, maxWidth: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative' }}>
        <h2 className="bidshipprofile-h2">Shipping Details</h2>
        <form>
          <div className="bidshipprofile-form-grid">
            <div className="bidshipprofile-form-group">
              <label className="bidshipprofile-label"><FaUser /> Full Name</label>
              <input type="text" value={details.fullname} readOnly className="bidshipprofile-input" />
            </div>
            <div className="bidshipprofile-form-group">
              <label className="bidshipprofile-label"><FaEnvelope /> Email</label>
              <input type="email" value={details.email} readOnly className="bidshipprofile-input" />
            </div>
            <div className="bidshipprofile-form-group">
              <label className="bidshipprofile-label"><FaCalendarAlt /> Age</label>
              <input type="number" value={details.age} readOnly className="bidshipprofile-input" />
            </div>
            <div className="bidshipprofile-form-group">
              <label className="bidshipprofile-label"><FaPhone /> Mobile Number</label>
              <input type="tel" value={details.mobileNo} readOnly className="bidshipprofile-input" />
            </div>
            <div className="bidshipprofile-form-group full-width">
              <label className="bidshipprofile-label"><FaMapMarkerAlt /> Shipping Address</label>
              <textarea value={details.shippingAddress} readOnly className="bidshipprofile-textarea" />
            </div>
            <div className="bidshipprofile-form-group">
              <label className="bidshipprofile-label"><FaMapPin /> Postal Code</label>
              <input type="text" value={details.postalCode} readOnly className="bidshipprofile-input" />
            </div>
            <div className="bidshipprofile-form-group">
              <label className="bidshipprofile-label"><FaGlobe /> Country</label>
              <input type="text" value={details.country} readOnly className="bidshipprofile-input" />
            </div>
          </div>
          <div className="bidshipprofile-button-group" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="bidshipprofile-btn-cancel" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewShipDetails; 