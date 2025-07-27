import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./Nav.css";
import NotificationBell from "../NotificationBell/NotificationBell";

function Nav() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const username = JSON.parse(localStorage.getItem("user"))?.username;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!username) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${username}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [username]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          setUser(null); // Clear if no userId found
          return;
        }

        const { data } = await axios.get(`http://localhost:5000/users/${userId}`);
        setUser(data.user);
      } catch (err) {
        console.error("Failed to load user info", err);
        setUser(null); // Reset on failure
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null); // Clear user state
    window.location.href = "/login"; // Full refresh to clear navbar
  };

  // Search handler
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await axios.get("http://localhost:5000/items");
      const items = Array.isArray(res.data) ? res.data : res.data.items || [];
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSuggestions(true);
    } catch (err) {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate(`/item/${item._id}`);
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <NavLink to="/home">
            <img src="/favicon.ico" alt="AuctionApp Logo" className="logo-img" />
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="navsearch-bar" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setShowSuggestions(false);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSearch();
            }}
            onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
          />
          <button className="navsearch-btn" onClick={handleSearch}>Search</button>
          {showSuggestions && searchResults.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '42px',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderTop: 'none',
              zIndex: 100,
              maxHeight: '200px',
              overflowY: 'auto',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              {searchResults.slice(0, 5).map(item => (
                <li
                  key={item._id}
                  onMouseDown={() => handleSuggestionClick(item)}
                  style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#222' }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <NavLink to="/home" activeClassName="active">Home</NavLink>
          <NavLink to="/aboutUs" activeClassName="active">About Us</NavLink>
          <NavLink to="/contactUs" activeClassName="active">Contact Us</NavLink>

          {!user ? (
            <NavLink to="/login" className="login-btn">Login</NavLink>
          ) : (
            <>
              <NotificationBell username={username} fetchNotifications={fetchNotifications} />
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              <NavLink to="/profile" className="profile-widget">
  <img
    src={
      user.profileImage
        ? `http://localhost:5000${user.profileImage}`
        : "/images/default-avatar.png"
    }
    alt="Profile"
    className="nav-profile-image"
  />
  <span className="nav-profile-name">{user.name}</span>
</NavLink>

            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
