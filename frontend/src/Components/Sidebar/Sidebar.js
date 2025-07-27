import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser, FaUsers, FaTasks, FaMoneyCheckAlt, FaBoxOpen, 
  FaGavel, FaShippingFast, FaFileAlt, FaUserShield, FaRegClipboard, FaBars,FaSyncAlt,FaMapMarkerAlt
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const [isOpen, setIsOpen] = useState(() => {
    // get persisted value on load
    return localStorage.getItem("sidebarOpen") === "true";
  });

  useEffect(() => {
    // update localStorage on state change
    localStorage.setItem("sidebarOpen", isOpen);
  }, [isOpen]);

  if (!user || !role) return null;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderLink = (to, Icon, label) => (
    <Link to={to} className="sidebar-link">
      <Icon className="sidebar-icon" />
      {isOpen && <span>{label}</span>}
    </Link>
  );

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {role === "sl" && (
        <>
          {renderLink("/seller-dashboard", FaUser, "Seller Dashboard")}
          {renderLink("/seller-listing", FaBoxOpen, "Item Listing")}
          {renderLink("/seller-profile", FaUser, "Seller Profile")}
          {renderLink("/add-item", FaGavel, "Add Item")}
         
        </>
      )}
      {role === "bid" && (
        <>
          {renderLink("/BidDashboard", FaUser, "Bidder Dashboard")}
          {renderLink("/items-gallery", FaGavel, "Bid Now")}
          {renderLink("/shipping", FaShippingFast, "Shipping Details")}
         
          {renderLink("/bidder-profile", FaUser, "Profile")}
          {renderLink("/BidFeedbackPage", FaRegClipboard, "Feedback")}
           {renderLink("/track", FaMapMarkerAlt, "Track My Shipment")}
        </>
      )}
      {role === "ship" && (
        <>
          {renderLink("/shipmanagedash", FaShippingFast, "Shipping Dashboard")}
          {renderLink("/shipments", FaTasks, "Manage Shipments")}
          {renderLink("/all-shipments-card", FaTasks, "All Shipments")}
          {renderLink("/status", FaSyncAlt, "Update Shipment Status")}
          {renderLink("/couriers", FaMapMarkerAlt, "Courier Dashboard")}
          
        </>
      )}
      {role === "hr" && (
        <>
          {renderLink("/hrDashboard", FaUserShield, "HR Dashboard")}
          {renderLink("/employeeDashboard", FaUsers, "Employee Management")}
          {renderLink("/tasks", FaTasks, "Task Management")}
          {renderLink("/payroll", FaMoneyCheckAlt, "Payroll")}
        </>
      )}
      {role === "im" && (
        <>
         {renderLink("/inspectionDashboard", FaUserShield, "Dashboard")}
{renderLink("/add-report", FaRegClipboard, "Add Report")}
{renderLink("/flagged-items", FaFileAlt, "Report Dashboard")}
               
{renderLink("/item-manager", FaTasks, "Manage Items")}          
{renderLink("/items-gallery", FaGavel, "Bidding Items")}    
        </>
      )}
    </div>
  );
}

export default Sidebar;
