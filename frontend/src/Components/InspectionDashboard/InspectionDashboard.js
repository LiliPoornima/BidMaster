import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InspectionDashboard.css';

const InspectionDashboard = () => {
  const navigate = useNavigate();
  const [itemStats, setItemStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemStats();
    fetchRecentItems();
  }, []);

  const fetchItemStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/items/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch item statistics');
      }
      const data = await response.json();
      setItemStats({
        pending: data.pending || 0,
        approved: data.approved || 0,
        rejected: data.rejected || 0,
        flagged: data.flagged || 0
      });
    } catch (err) {
      console.error('Error fetching item stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();

      // Filter only 'Approved' and 'Pending' items
      const filtered = data.filter(
        (item) =>
          item.inspectionStatus === 'Approved' ||
          item.inspectionStatus === 'Pending'
      );

      // Sort by date (newest first) and take latest 3
      const sortedItems = filtered
        .sort(
          (a, b) =>
            new Date(b.createdAt || Date.now()) -
            new Date(a.createdAt || Date.now())
        )
        .slice(0, 3);

      setRecentItems(sortedItems);
    } catch (err) {
      console.error('Error fetching recent items:', err);
      setRecentItems([]);
    }
  };

  const handleItemViewClick = (item) => {
    navigate(`/item/${item._id}`);
  };

  const handleManageItemsClick = () => {
    navigate('/item-manager');
  };

 

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <section className="dash-hero-section">
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">Inspection Manager Dashboard</h1>
          <p className="dash-hero-subtitle">Monitor and manage auction items</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dash-actions-section">
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-actions-grid">
        
          <div className="dash-action-card" onClick={handleManageItemsClick}>
            <div className="action-icon-container">
              <i className="action-icon fas fa-tasks"></i>
            </div>
            <h3>Manage Items</h3>
          </div>
          <div
            className="dash-action-card"
            onClick={() => navigate('/items-gallery')}
          >
            <div className="action-icon-container">
              <i className="action-icon fas fa-images"></i>
            </div>
            <h3>View Gallery</h3>
          </div>
          <div
            className="dash-action-card"
            onClick={() => navigate('/add-report')}
          >
            <div className="action-icon-container">
              <i className="action-icon fas fa-flag"></i>
            </div>
            <h3>Add New Report</h3>
          </div>
          <div
            className="dash-action-card"
            onClick={() => navigate('/flagged-items')}
          >
            <div className="action-icon-container">
              <i className="action-icon fas fa-exclamation-circle"></i>
            </div>
            <h3>View Reports</h3>
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="dash-activity-section">
        <div className="section-header">
          <h2 className="dash-section-title">Recent Items</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate('/items-gallery')}
          >
            View All
          </button>
        </div>
        <div className="dash-activity-grid">
          {recentItems.length === 0 ? (
            <p className="no-items">No items available.</p>
          ) : (
            recentItems.map((item) => (
              <div key={item._id} className="dash-activity-item">
                <div
                  className={`activity-status status-${item.inspectionStatus
                    ?.toLowerCase()
                    .replace(' ', '-') || 'pending'}`}
                >
                  {item.inspectionStatus || 'Pending'}
                </div>
                <img
                  src={
                    item.image && item.image.startsWith('/uploads')
                      ? `http://localhost:5000${item.image}`
                      : `https://via.placeholder.com/150?text=${encodeURIComponent(
                          item.name || 'Item'
                        )}`
                  }
                  alt={item.name}
                  className="activity-image"
                />
                <div className="activity-details">
                  <h3>{item.name}</h3>
                  <p>
                    <i className="far fa-calendar-alt"></i> Added:{' '}
                    {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                  {item.price && (
                    <p className="item-price">
                      <i className="fas fa-tag"></i> $
                      {parseFloat(item.price).toFixed(2)}
                    </p>
                  )}
                  {item.inspectionStatus === 'Approved' &&
                    item.startingPrice && (
                      <p className="starting-bid">
                        <i className="fas fa-gavel"></i> Starting bid: $
                        {parseFloat(item.startingPrice).toFixed(2)}
                      </p>
                    )}
                  <button
                    className="view-item-btn"
                    onClick={() => handleItemViewClick(item)}
                  >
                    <i className="fas fa-search"></i> Review Item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default InspectionDashboard;
