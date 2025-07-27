import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemsGallery.css';
import Nav from '../Nav/Nav';

function ItemsGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/items')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch items');
        }
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching items:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (item) => {
    navigate(`/item/${item._id}`);
  };

  // ✅ Filter only APPROVED items
  const approvedItems = items.filter(item => item.inspectionStatus === 'Approved');

  const filteredItems = approvedItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuggestionClick = (item) => {
    setSearchTerm('');
    setShowSuggestions(false);
    navigate(`/item/${item._id}`);
  };

  if (loading) return (
    <div className="gallery-container">
      <Nav />
      <div className="loading">Loading items...</div>
    </div>
  );

  if (error) return (
    <div className="gallery-container">
      <Nav />
      <div className="error">Error: {error}</div>
    </div>
  );

  return (
    <div className="gallery-container">
      <Nav />
      <br /><br /><br /><br />
     
      <div className="gallery-grid">
        {filteredItems.length === 0 ? (
          <p>No items available in the gallery.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className="gallery-item">
              {parseFloat(item.price) < 30 && <span className="sale-badge">SALE</span>}
              <img
                src={item.image.startsWith('/uploads')
                  ? `http://localhost:5000${item.image}`
                  : `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`}
                alt={item.name}
                className="item-image"
              />
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description.substring(0, 60)}...</p>
              <p className="item-price">${parseFloat(item.price).toFixed(2)}</p>
              <p className="bidding-info">
                Starting bid: ${parseFloat(item.startingPrice || item.price).toFixed(2)}
              </p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleViewDetails(item)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ItemsGallery;
