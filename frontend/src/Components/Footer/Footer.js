import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Import CSS file

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & About */}
        <div className="footer-section">
          <h3>Bid Master</h3>
          <p>Secure and transparent online auctions for everyone.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/aboutUs">About Us</Link></li>
            <li><Link to="/contactUs">Contact Us</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
           
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@bidmaster.com</p>
          <p>Phone: +94 774 567 890</p>
          <p>Address: 123 Auction Street, Kandy</p>
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/facebook.png" alt="Facebook" className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/twitter.png" alt="Twitter" className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/instagram.png" alt="Instagram" className="social-icon" />
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/whatsapp.png" alt="LinkedIn" className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BidMaster. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
