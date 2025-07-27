import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { FaTwitter, FaInstagram, FaFacebook, FaGithub } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/users/${userId}`);
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });
      } catch (err) {
        setError("Failed to fetch user profile.");
        console.error(err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image to upload.");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(`http://localhost:5000/users/upload/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Image uploaded successfully!");
      setUser((prev) => ({
        ...prev,
        profileImage: response.data.user.profileImage,
      }));
    } catch (err) {
      alert("Image upload failed.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}`, formData);
      alert("Profile updated successfully!");
      setUser(response.data.user);
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile.");
      console.error(err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={user.profileImage ? `http://localhost:5000${user.profileImage}` : "https://via.placeholder.com/150"}
          alt="Profile"
        />
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p>{user.username}</p>
          
          <div className="profile-actions">
            <form onSubmit={handleImageUpload}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button type="submit">Upload</button>
            </form>
            {!editMode && <button onClick={() => setEditMode(true)}>Edit Profile</button>}
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="info-card">
          <h3>Information</h3>
          {editMode ? (
            <>
              <div className="info-item">
                <span>Name:</span>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="info-item">
                <span>Email:</span>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="info-item">
                <span>Phone:</span>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="btn-group">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="info-item"><span>Name:</span> {user.name}</div>
              <div className="info-item"><span>Email:</span> {user.email}</div>
              <div className="info-item"><span>Phone:</span> {user.phone}</div>
              <div className="info-item"><span>Username:</span> {user.username}</div>
            </>
          )}
        </div>

        <div className="social-card">
          <h3>Social Media</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /> Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /> GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;