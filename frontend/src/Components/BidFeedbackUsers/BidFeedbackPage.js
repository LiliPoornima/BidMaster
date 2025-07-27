// BidFeedbackPage.js - Modernized UI while maintaining all functionality
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BidFeedbackPage.css';
import { FaStar, FaRegStar, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner, FaComments, FaPencilAlt } from 'react-icons/fa';

const BidFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rating: '',
    feedback: '',
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const apiBaseUrl = 'http://localhost:5000/bid-feedback-users/';

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiBaseUrl);
      console.log('Feedback API Response:', JSON.stringify(response.data, null, 2));
      const feedbackData = response.data.bidFeedbackUsers || [];
      setFeedbackList(feedbackData);
      console.log('Feedback list set to:', JSON.stringify(feedbackData, null, 2));
    } catch (err) {
      console.error('Error fetching feedback:', err.response ? err.response.data : err.message);
      setError('Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? (value === '' ? '' : parseInt(value, 10)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmSubmit = window.confirm(
      editingId ? 'Are you sure you want to update this feedback?' : 'Are you sure you want to submit this feedback?'
    );
    if (confirmSubmit) {
      try {
        if (editingId) {
          await axios.put(`${apiBaseUrl}${editingId}`, formData);
          alert('Feedback updated successfully!');
        } else {
          console.log('Submitting feedback:', formData);
          const response = await axios.post(apiBaseUrl, formData);
          console.log('Submit response:', response.data);
          alert('Feedback submitted successfully!');
        }
        setFormData({ name: '', rating: '', feedback: '' });
        setEditingId(null);
        fetchFeedback();
      } catch (err) {
        console.error('Error saving feedback:', err.response ? err.response.data : err.message);
        setError('Failed to save feedback.');
      }
    }
  };

  const handleEdit = (feedback) => {
    setFormData({
      name: feedback.name,
      rating: feedback.rating,
      feedback: feedback.feedback,
    });
    setEditingId(feedback._id);
    
    // Scroll to form when editing
    const formElement = document.querySelector('.bidfeedback-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cancelEdit = () => {
    setFormData({ name: '', rating: '', feedback: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
    if (confirmDelete) {
      try {
        await axios.delete(`${apiBaseUrl}${id}`);
        alert('Feedback deleted successfully!');
        fetchFeedback();
      } catch (err) {
        console.error('Error deleting feedback:', err.response ? err.response.data : err.message);
        setError('Failed to delete feedback.');
      }
    }
  };

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="bidfeedback-star" />);
      } else {
        stars.push(<FaRegStar key={i} className="bidfeedback-star" style={{ color: '#bdc3c7' }} />);
      }
    }
    return (
      <div className="bidfeedback-rating">
        {stars}
        <span className="bidfeedback-rating-text">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bidfeedback-loading">
        Loading Feedback <FaSpinner className="fa-spin" />
      </div>
    );
  }

  return (
    <div className="bidfeedback-page-wrapper">
      <div className="bidfeedback-profile-container">
        <h1>Customer Feedback</h1>

        {error && <div className="bidfeedback-error-message">{error}</div>}

        <div className="bidfeedback-form-container">
          <h2><FaPencilAlt /> {editingId ? 'Edit Feedback' : 'Submit Feedback'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="bidfeedback-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="bidfeedback-form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                required
              >
                <option value="">Select rating</option>
                <option value="1">1 Star - Poor</option>
                <option value="2">2 Stars - Fair</option>
                <option value="3">3 Stars - Good</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="5">5 Stars - Excellent</option>
              </select>
            </div>
            
            <div className="bidfeedback-form-group">
              <label htmlFor="feedback">Your Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                placeholder="Share your thoughts about our service..."
                required
              />
            </div>
            
            <div className="bidfeedback-button-group">
              <button type="submit" className="bidfeedback-btn-save">
                {editingId ? <><FaCheck /> Update Feedback</> : <><FaCheck /> Submit Feedback</>}
              </button>
              {editingId && (
                <button type="button" className="bidfeedback-btn-cancel" onClick={cancelEdit}>
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bidfeedback-list">
          <h2><FaComments /> Customer Reviews</h2>
          {feedbackList.length === 0 ? (
            <p>No feedback available yet. Be the first to share your experience!</p>
          ) : (
            feedbackList.map((fb) => (
              <div key={fb._id} className="bidfeedback-item">
                <div className="bidfeedback-item-content">
                  <strong>{fb.name}</strong>
                  {renderStars(fb.rating)}
                  <div className="bidfeedback-text">{fb.feedback}</div>
                </div>
                <div className="bidfeedback-item-buttons">
                 
                 
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BidFeedbackPage;