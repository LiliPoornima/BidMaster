import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './ItemView.css';

function ItemView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    fetch(`http://localhost:5000/items/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch item');
        }
        return res.json();
      })
      .then(data => {
        setItem(data);
        const mainImagePath = data.image && data.image.startsWith('/uploads') 
          ? `http://localhost:5000${data.image}` 
          : `https://via.placeholder.com/400x300?text=${encodeURIComponent(data.name)}`;
        setMainImage(mainImagePath);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching item:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);
  
  useEffect(() => {
    let timer;
    if (item && item.biddingEndTime) {
      timer = setInterval(() => {
        const now = new Date();
        const end = new Date(item.biddingEndTime);
        const diff = end - now;
        
        if (diff <= 0) {
          setTimeLeft('Bidding ended');
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [item]);
  
  const handleThumbnailClick = (imgSrc) => {
    setMainImage(imgSrc);
  };
  
  const handlePlaceBid = () => {
   
    navigate('/bid-now/' + id);  // For future implementation
  };
  
  if (loading) return <div className="item-view-container"><Nav /><div className="loading">Loading item details...</div></div>;
  if (error) return <div className="item-view-container"><Nav /><div className="error">Error: {error}</div></div>;
  if (!item) return <div className="item-view-container"><Nav /><div className="not-found">Item not found</div></div>;

  return (
    <div className="item-view-container">
      <Nav />
      <br/><br/><br/><br/>
      <div className="item-view-content">
        <div className="item-images-section">
          <div className="main-image-container">
            <img src={mainImage} alt={item.name} className="main-image" />
          </div>
          <div className="thumbnails-container">
            <div 
              className={`thumbnail ${mainImage === (item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}`) ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}`)}
            >
              <img 
                src={item.image.startsWith('/uploads')
                  ? `http://localhost:5000${item.image}`
                  : `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`}
                alt={item.name}
                className="item-image"
              />
            </div>
            {item.additionalImages && item.additionalImages.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${mainImage === `http://localhost:5000${img}` ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(`http://localhost:5000${img}`)}
              >
                <img src={`http://localhost:5000${img}`} alt={`${item.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="item-details-section">
          <h1 className="item-title">{item.name}</h1>
          
          <div className="item-price-info">
            <div className="price-container">
              <h3>Starting Price</h3>
              <p className="starting-price">${parseFloat(item.startingPrice || item.price).toFixed(2)}</p>
            </div>
            
            <div className="bid-timer-container">
              <h3>Bidding Ends In</h3>
              <p className="bid-timer">{timeLeft}</p>
            </div>
          </div>
          
          {/* Description section */}
          <div className="item-description-section">
            <h2 className="section-title">
              <span className="icon">ⓘ</span> Description
            </h2>
            <div className="item-description">
              {item.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* Item Details section - similar to the image provided */}
          <div className="item-details-container">
            <h2 className="section-title">Item Details</h2>
            
            <div className="details-grid">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Condition</span>
                  <span className="detail-value">{item.condition || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Provenance</span>
                  <span className="detail-value">{item.provenance || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Dimensions</span>
                  <span className="detail-value">{item.dimensions || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Weight</span>
                  <span className="detail-value">{item.weight || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Material</span>
                  <span className="detail-value">{item.material || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Maker</span>
                  <span className="detail-value">{item.maker || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Year</span>
                  <span className="detail-value">{item.year || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Authenticity</span>
                  <span className="detail-value">{item.authenticity || 'Not verified'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="bid-button" onClick={handlePlaceBid}>Place Bid</button>
            <button className="back-button" onClick={() => navigate('/items-gallery')}>Back to Gallery</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemView;