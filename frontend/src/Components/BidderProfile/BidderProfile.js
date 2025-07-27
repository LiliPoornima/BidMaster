// BidderProfile.js - Enhanced with modern UI but same functionality
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './BidderProfile.css';
import { FaMapMarkerAlt, FaGlobe, FaGithub, FaTwitter, FaInstagram, FaFacebook, FaUserEdit } from 'react-icons/fa';

const BidderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch profile data from the API - keeping original functionality
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/bid-users');
      console.log('API response:', response.data);
      if (response.data.bidUsers && response.data.bidUsers.length > 0) {
        setProfile(response.data.bidUsers[0]);
        console.log('Profile set to:', response.data.bidUsers[0]);
      } else {
        setProfile(null);
        console.log('No users found, profile set to null');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response && err.response.status === 404) {
        setProfile(null);
        console.log('404 received, profile set to null');
      } else {
        setError('Failed to load profile.');
        console.log('Error details:', err.response ? err.response.data : err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile when the component mounts or location changes
  useEffect(() => {
    fetchProfile();
  }, [location]);

  // Re-fetch profile if recently updated or deleted
  useEffect(() => {
    if (location.state?.justUpdated || location.state?.justDeleted) {
      fetchProfile();
    }
  }, [location.state]);

  // Navigate to the edit profile page
  const handleEditProfile = () => {
    if (profile) {
      navigate('/edit-bidder-profile', { state: { editDetail: profile } });
    } else {
      navigate('/edit-bidder-profile');
    }
  };

  if (loading) {
    return <div className="bidprofile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="bidprofile-error-message">{error}</div>;
  }

  // Default values for a blank profile - keeping original logic
  const blankProfile = {
    name: 'Not set',
    address: 'Not set',
    email: 'Not set',
    phone: 'Not set',
    gender: 'Not set',
    username: 'Not set',
    picture: null,
  };

  const displayProfile = profile || blankProfile;
  const isBlank = !profile;

  // Calculate progress percentages
  const getProgressWidth = (index) => {
    if (isBlank) return '0%';
    const values = [75, 50, 30, 60]; // Sample values as in the original code
    return `${values[index]}%`;
  };

  return (
    <div className="bidprofile-bidder-profile-container">
      <h1 className="bidprofile-h1">My Bidder Profile</h1>
      <div className={`bidprofile-profile-wrapper ${isBlank ? 'bidprofile-blank-profile' : ''}`}>
        <div className="bidprofile-profile-left">
          <div className="bidprofile-profile-pic-section">
            {displayProfile.picture ? (
              <img
                src={`http://localhost:5000/${displayProfile.picture}`}
                alt="Profile"
                className="bidprofile-profile-pic"
                onError={(e) => {
                  console.log('Image load error:', e);
                  e.target.src = 'https://via.placeholder.com/150?text=User';
                }}
              />
            ) : (
              <div className="bidprofile-pic-placeholder">
                <span role="img" aria-label="user">👤</span>
              </div>
            )}
          </div>
          <h2>
            {displayProfile.name}
            {!isBlank && <span className="bidprofile-verified-badge">Verified</span>}
          </h2>
          <p className="bidprofile-location">
            <FaMapMarkerAlt /> {displayProfile.address}
          </p>
          <div className="bidprofile-action-buttons">
            <button className="bidprofile-btn-follow" disabled={isBlank}>
              Follow
            </button>
            <button className="bidprofile-btn-message" disabled={isBlank}>
              Message
            </button>
          </div>
          <div className="bidprofile-social-links">
            <h3>Connect</h3>
            <ul>
              <li>
                <span className="bidprofile-icon website">
                  <FaGlobe />
                </span>
                {isBlank ? (
                  <span className="bidprofile-not-set">Not set</span>
                ) : (
                  <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                )}
              </li>
              <li>
                <span className="bidprofile-icon github">
                  <FaGithub />
                </span>
                {isBlank ? (
                  <span className="bidprofile-not-set">Not set</span>
                ) : (
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    Github
                  </a>
                )}
              </li>
              <li>
                <span className="bidprofile-icon twitter">
                  <FaTwitter />
                </span>
                {isBlank ? (
                  <span className="bidprofile-not-set">Not set</span>
                ) : (
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                )}
              </li>
              <li>
                <span className="bidprofile-icon instagram">
                  <FaInstagram />
                </span>
                {isBlank ? (
                  <span className="bidprofile-not-set">Not set</span>
                ) : (
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
              </li>
              <li>
                <span className="bidprofile-icon facebook">
                  <FaFacebook />
                </span>
                {isBlank ? (
                  <span className="bidprofile-not-set">Not set</span>
                ) : (
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="bidprofile-profile-right">
          <div className="bidprofile-profile-details bidprofile-card">
            <h3>Personal Information</h3>
            <div className="bidprofile-detail-item">
              <span className="bidprofile-label">Full Name</span>
              <span className={`bidprofile-value ${isBlank ? 'bidprofile-not-set' : ''}`}>
                {displayProfile.name}
              </span>
            </div>
            <div className="bidprofile-detail-item">
              <span className="bidprofile-label">Email</span>
              <span className={`bidprofile-value ${isBlank ? 'bidprofile-not-set' : ''}`}>
                {displayProfile.email}
              </span>
            </div>
            <div className="bidprofile-detail-item">
              <span className="bidprofile-label">Phone</span>
              <span className={`bidprofile-value ${isBlank ? 'bidprofile-not-set' : ''}`}>
                {displayProfile.phone}
              </span>
            </div>
            <div className="bidprofile-detail-item">
              <span className="bidprofile-label">Mobile</span>
              <span className={`bidprofile-value ${isBlank ? 'bidprofile-not-set' : ''}`}>
                {displayProfile.phone}
              </span>
            </div>
            <div className="bidprofile-detail-item">
              <span className="bidprofile-label">Address</span>
              <span className={`bidprofile-value ${isBlank ? 'bidprofile-not-set' : ''}`}>
                {displayProfile.address}
              </span>
            </div>
            <div className="bidprofile-detail-item">
              <span className="bidprofile-label">Gender</span>
              <span className={`bidprofile-value ${isBlank ? 'bidprofile-not-set' : ''}`}>
                {displayProfile.gender}
              </span>
            </div>
            <div className="bidprofile-detail-item">
              <span className="bidprofile-label">Username</span>
              <span className={`bidprofile-value ${isBlank ? 'bidprofile-not-set' : ''}`}>
                {displayProfile.username}
              </span>
            </div>
            <button className="bidprofile-btn-edit" onClick={handleEditProfile}>
              <FaUserEdit /> {isBlank ? 'Create Profile' : 'Edit Profile'}
            </button>
          </div>
          <div className="bidprofile-auction-stats bidprofile-card">
            <h3>Auction Statistics</h3>
            {isBlank ? (
              <p className="bidprofile-not-set">No auction activity yet.</p>
            ) : (
              <>
                <div className="bidprofile-stat-item">
                  <div className="bidprofile-stat-label">
                    <span>Bids Placed</span>
                    <span className="bidprofile-stat-value">75%</span>
                  </div>
                  <div className="bidprofile-progress-bar">
                    <div className="bidprofile-progress" style={{ width: getProgressWidth(0) }}></div>
                  </div>
                </div>
                <div className="bidprofile-stat-item">
                  <div className="bidprofile-stat-label">
                    <span>Auctions Won</span>
                    <span className="bidprofile-stat-value">50%</span>
                  </div>
                  <div className="bidprofile-progress-bar">
                    <div className="bidprofile-progress" style={{ width: getProgressWidth(1) }}></div>
                  </div>
                </div>
                <div className="bidprofile-stat-item">
                  <div className="bidprofile-stat-label">
                    <span>Active Bids</span>
                    <span className="bidprofile-stat-value">30%</span>
                  </div>
                  <div className="bidprofile-progress-bar">
                    <div className="bidprofile-progress" style={{ width: getProgressWidth(2) }}></div>
                  </div>
                </div>
                <div className="bidprofile-stat-item">
                  <div className="bidprofile-stat-label">
                    <span>Total Spent</span>
                    <span className="bidprofile-stat-value">60%</span>
                  </div>
                  <div className="bidprofile-progress-bar">
                    <div className="bidprofile-progress" style={{ width: getProgressWidth(3) }}></div>
                  </div>
                </div>
                
                {/* Add Bid Activity Summary - New Feature */}
                <div className="bidprofile-activity-summary">
                  <h4>Recent Activity</h4>
                  <div className="bidprofile-activity-items">
                    <div className="bidprofile-activity-item">
                      <div className="bidprofile-activity-icon bid"></div>
                      <div className="bidprofile-activity-content">
                        <div className="bidprofile-activity-title">Vintage Watch</div>
                        <div className="bidprofile-activity-details">
                          <span className="bidprofile-activity-amount">$250</span>
                          <span className="bidprofile-activity-time">2 days ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="bidprofile-activity-item">
                      <div className="bidprofile-activity-icon won"></div>
                      <div className="bidprofile-activity-content">
                        <div className="bidprofile-activity-title">Antique Clock</div>
                        <div className="bidprofile-activity-details">
                          <span className="bidprofile-activity-amount">$175</span>
                          <span className="bidprofile-activity-time">1 week ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidderProfile;