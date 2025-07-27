import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShipManageDash.css';

function ShipManageDash() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState({
    totalCouriers: 0,
    totalPending: 0,
    totalDelivered: 0,
  });

  useEffect(() => {
    fetchShipments();
    fetchStats();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/shipment/all');
      const data = await res.json();
      const sorted = [...data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setShipments(sorted);
    } catch (err) {
      console.error('Failed to fetch shipments', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courier/dashboard/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  return (
    <div className="shipDash-page">
      {/* Hero Section */}
      <section className="shipDash-hero-section">
        <div className="shipDash-hero-content">
          <h1 className="shipDash-title">Shipping Dashboard</h1>
          <p className="shipDash-subtitle">Manage Courier Assignments and Shipments</p>
        </div>
      </section>

      {/* 📦 Dashboard Stats Section */}
      <section className="shipDash-stats-section">
        <div className="shipDash-stats-grid">
          <div className="shipDash-stat-card">
            <h3>Total Courier Companies</h3>
            <p>{stats.totalCouriers}</p>
          </div>
          <div className="shipDash-stat-card">
            <h3>Total Pending Shipments</h3>
            <p>{stats.totalPending}</p>
          </div>
          <div className="shipDash-stat-card">
            <h3>Total Delivered Shipments</h3>
            <p>{stats.totalDelivered}</p>
          </div>
        </div>
      </section>

      {/* 🚀 Quick Actions */}
      <section className="shipDash-actions-section">
        <h2 className="shipDash-section-title">Quick Actions</h2>
        <div className="shipDash-actions-grid">
          <div className="shipDash-action-card" onClick={() => navigate('/shipments')}>
            <div className="shipDash-action-icon-container">
              <i className="fas fa-shipping-fast shipDash-action-icon"></i>
            </div>
            <h3>Manage Shipments</h3>
          </div>
          <div className="shipDash-action-card" onClick={() => navigate('/couriers')}>
            <div className="shipDash-action-icon-container">
              <i className="fas fa-truck-moving shipDash-action-icon"></i>
            </div>
            <h3>View Couriers</h3>
          </div>
          <div className="shipDash-action-card" onClick={() => navigate('/status')}>
            <div className="shipDash-action-icon-container">
              <i className="fas fa-edit shipDash-action-icon"></i>
            </div>
            <h3>Update Status</h3>
          </div>
          <div className="shipDash-action-card" onClick={() => navigate('/all-shipments-card')}>
            <div className="shipDash-action-icon-container">
              <i className="fas fa-list shipDash-action-icon"></i>
            </div>
            <h3>All Shipments</h3>
          </div>
        </div>
      </section>

      {/* 🕒 Recent Shipments */}
      <section className="shipDash-activity-section">
        <div className="shipDash-section-header">
          <h2 className="shipDash-section-title">Recent Shipments</h2>
          <button className="shipDash-view-all-btn" onClick={() => navigate('/shipments')}>
            View All
          </button>
        </div>
        <div className="shipDash-activity-grid">
          {shipments.length === 0 ? (
            <p className="shipDash-no-items">No recent shipments available.</p>
          ) : (
            shipments.map((s) => (
              <div key={s._id} className="shipDash-activity-item">
                <div className={`shipDash-status shipDash-status-${s.status?.toLowerCase().replace(/\s/g, '-')}`}>
                  {s.status}
                </div>
                <div className="shipDash-activity-details">
                  <h3>{s.itemname}</h3>
                  <p><i className="fas fa-map-marker-alt"></i> {s.from} → {s.to}</p>
                  <p><i className="far fa-calendar-alt"></i> {new Date(s.createdAt).toLocaleDateString()}</p>
                  <button className="shipDash-view-item-btn" onClick={() => navigate('/all-shipments-card')}>
                    <i className="fas fa-search"></i> View Shipment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ShipManageDash;
