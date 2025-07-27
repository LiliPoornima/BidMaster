// BidShipUsersDetails.js - Enhanced with modern UI while maintaining functionality
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BidShipUsersDetails.css';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGlobe,
  FaMapPin,
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaUsers,
  FaShippingFast,
  FaFlag,
  FaInfoCircle
} from 'react-icons/fa';

const BidShipUsersDetails = () => {
  // Keeping the same state management
  const [shipDetails, setShipDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add new state for search and filter functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  const navigate = useNavigate();

  // Same useEffect to fetch data on component mount
  useEffect(() => {
    fetchShipDetails();
  }, []);

  // Same function to fetch shipping details
  const fetchShipDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/bid-ship-users');
      setShipDetails(response.data.bidShipUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch shipping details. Please try again later.');
      console.error('Error fetching shipping details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Same function to handle update 
  const handleUpdate = (detail) => {
    navigate('/BidShipProfile', { state: { editDetail: detail } });
  };

  // Same function to handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipping detail?')) {
      try {
        await axios.delete(`http://localhost:5000/bid-ship-users/${id}`);
        fetchShipDetails(); // Refetch data after deletion
      } catch (err) {
        setError('Failed to delete shipping detail.');
        console.error('Error deleting shipping detail:', err);
      }
    }
  };

  // Same function to handle adding a new shipping detail
  const handleAdd = () => {
    navigate('/BidShipProfile');
  };

  // New function to filter and sort shipping details
  const getFilteredShipDetails = () => {
    return shipDetails
      .filter(detail => 
        detail.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        detail.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.country?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(detail => 
        filterCountry ? detail.country?.toLowerCase() === filterCountry.toLowerCase() : true
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.fullname?.localeCompare(b.fullname);
        } else if (sortBy === "country") {
          return a.country?.localeCompare(b.country);
        } else if (sortBy === "age") {
          return (a.age || 0) - (b.age || 0);
        }
        return 0;
      });
  };

  // Get unique countries for filter dropdown
  const getUniqueCountries = () => {
    const countries = shipDetails
      .map(detail => detail.country)
      .filter(country => country) // Remove undefined/null
      .filter((country, index, self) => self.indexOf(country) === index); // Get unique values
    
    return countries;
  };

  // Calculate summary statistics
  const totalShippingDetails = shipDetails.length;
  const uniqueCountries = new Set(shipDetails.map(detail => detail.country?.toLowerCase())).size;

  // Loading state - same as before
  if (loading) {
    return <div className="BidShipUserDetailsLoading">Loading shipping details...</div>;
  }

  // Get filtered shipping details
  const filteredShipDetails = getFilteredShipDetails();

  // Function to get appropriate emoji flag for a country
  const getCountryFlag = (countryName) => {
    if (!countryName) return "🏳️";
    
    const countryLower = countryName.toLowerCase();
    if (countryLower.includes("sri") || countryLower.includes("lanka")) return "🇱🇰";
    if (countryLower.includes("japan")) return "🇯🇵";
    if (countryLower.includes("korea")) return "🇰🇷";
    return "🌎"; // Default globe flag
  };

  return (
    <div className="BidShipUserDetailsWrapper">
      <div className="BidShipUserDetailsContainer">
        <h1>My Shippings</h1>
        
        {error && <div className="BidShipUserDetailsErrorMessage">{error}</div>}
        
        {/* Info Cards Section */}
        {shipDetails.length > 0 && (
          <div className="BidShipUserDetailsInfoSection">
            <div className="BidShipUserDetailsInfoCards">
              <div className="BidShipUserDetailsInfoCard">
                <div className="BidShipUserDetailsInfoIcon">
                  <FaUsers />
                </div>
                <div className="BidShipUserDetailsInfoTitle">Total Shipping Profiles</div>
                <div className="BidShipUserDetailsInfoValue">{totalShippingDetails}</div>
              </div>
              
              <div className="BidShipUserDetailsInfoCard">
                <div className="BidShipUserDetailsInfoIcon">
                  <FaGlobe />
                </div>
                <div className="BidShipUserDetailsInfoTitle">Different Countries</div>
                <div className="BidShipUserDetailsInfoValue">{uniqueCountries}</div>
              </div>
              
              <div className="BidShipUserDetailsInfoCard">
                <div className="BidShipUserDetailsInfoIcon">
                  <FaShippingFast />
                </div>
                <div className="BidShipUserDetailsInfoTitle">Shipping Ready</div>
                <div className="BidShipUserDetailsInfoValue">
                  {shipDetails.length > 0 ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and Filter Bar */}
        {shipDetails.length > 0 && (
          <div className="BidShipUserDetailsFilterBar">
            <div className="BidShipUserDetailsSearch">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name, email or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="BidShipUserDetailsFilter">
              <label><FaFilter /> Filter by Country:</label>
              <select 
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {getUniqueCountries().map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className="BidShipUserDetailsFilter">
              <label><FaSort /> Sort by:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="country">Country</option>
                <option value="age">Age</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="BidShipUserDetailsShipDetailsList">
          {shipDetails.length === 0 ? (
            <div className="BidShipUserDetailsEmptyState">
              <FaInfoCircle size={60} color="#bdc3c7" />
              <h3>No Shipping Details Found</h3>
              <p>Add your shipping details to get started with auctions.</p>
              <button className="BidShipUserDetailsBtnAdd" onClick={handleAdd}>
                <FaPlus /> Add New Shipping Details
              </button>
            </div>
          ) : filteredShipDetails.length === 0 ? (
            <div className="BidShipUserDetailsNoDetails">
              No shipping details match your search criteria. Try changing your filters or add new details.
            </div>
          ) : (
            <div className="BidShipUserDetailsShipDetailCards">
              {filteredShipDetails.map((detail) => (
                <div key={detail._id} className="BidShipUserDetailsShipDetailCard">
                  <h3>
                    {detail.fullname}
                  </h3>
                  <div className="BidShipUserDetailsCountryBadge">
                    <span className="BidShipUserDetailsFlag">{getCountryFlag(detail.country)}</span>
                    {detail.country || "Unknown Country"}
                  </div>
                  
                  <div className="BidShipUserDetailsCardDetails">
                    <p>
                      <span><FaEnvelope /> Email:</span> 
                      {detail.email}
                    </p>
                    <p>
                      <span><FaCalendarAlt /> Age:</span> 
                      {detail.age}
                    </p>
                    <p>
                      <span><FaPhone /> Mobile:</span> 
                      {detail.mobileNo}
                    </p>
                    <p>
                      <span><FaMapMarkerAlt /> Shipping Address:</span> 
                      {detail.shippingAddress}
                    </p>
                    <p>
                      <span><FaMapPin /> Postal Code:</span> 
                      {detail.postalCode}
                    </p>
                  </div>
                  
                  <div className="BidShipUserDetailsCardActions">
                    <button className="BidShipUserDetailsBtnUpdate" onClick={() => handleUpdate(detail)}>
                      <FaEdit /> Update
                    </button>
                    <button className="BidShipUserDetailsBtnDelete" onClick={() => handleDelete(detail._id)}>
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {shipDetails.length > 0 && (
            <button className="BidShipUserDetailsBtnAdd" onClick={handleAdd}>
              <FaPlus /> Add New Shipping Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidShipUsersDetails;