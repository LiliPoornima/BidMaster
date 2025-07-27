import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", credentials);
      if (res.data.success) {
        const user = res.data.user;
        const rolePrefix = user.username.split("_")[0];

        // Save user and role in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);
        localStorage.setItem("role", rolePrefix);
        localStorage.setItem("username", user.username);
        localStorage.setItem("loggedInUserEmail", user.email);


        toast.success(`Welcome ${user.name}!`, {
          position: "top-right",
          autoClose: 3000,
        });
        

        // Navigate to role-based dashboard
        switch (rolePrefix) {
          case "hr":
            navigate("/hrDashboard");
            
            break;
          case "sl":
            navigate("/seller-dashboard");
            break;
          case "bid":
            navigate("/items-gallery");
            break;
          case "ship":
            navigate("/shipmanagedash");
            break;
          case "im":
            navigate("/inspectionDashboard");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <span className="input-icon"><FaUser /></span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon"><FaLock /></span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
         
          <button type="submit" className="login-button">Sign In</button>
        </form>

        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button className="social-btn facebook"><FaFacebookF /></button>
            <button className="social-btn twitter"><FaTwitter /></button>
            <button className="social-btn google"><FaGoogle /></button>
          </div>
        </div>

        <div className="signup-link">
          <p>Don't have an account?</p>
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

