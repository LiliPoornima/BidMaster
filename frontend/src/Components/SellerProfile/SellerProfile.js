import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Item from '../Item/Item';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './SellerProfile.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SellerProfile = () => {
  const navigate = useNavigate();

  const [sellerItems, setSellerItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCharts, setVisibleCharts] = useState({
    status: true,
    timeline: true,
    bids: true
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchSellerItems();
  }, []);

  const fetchSellerItems = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(`http://localhost:5000/items/seller/${username}`);
      const data = Array.isArray(response.data.item) ? response.data.item : [];
      setSellerItems(data);
    } catch (err) {
      console.error('Error fetching seller items:', err);
      setSellerItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    let items = [...sellerItems];

    if (statusFilter !== 'all') {
      items = items.filter((item) => item.inspectionStatus?.toLowerCase() === statusFilter);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const days =
        dateRange === '30days' ? 30 : dateRange === '90days' ? 90 : 365;
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - days);

      items = items.filter((item) => new Date(item.createdAt) >= cutoff);
    }

    return items;
  }, [sellerItems, statusFilter, dateRange]);

  const getItemStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    filteredItems.forEach((item) => {
      const status = item.inspectionStatus?.toLowerCase();
      if (status === 'pending') counts.pending++;
      else if (status === 'approved') counts.approved++;
      else if (status === 'rejected') counts.rejected++;
    });
    return counts;
  };

  const getItemsByMonth = () => {
    const months = Array(12).fill(0);
    const labels = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }

    filteredItems.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const monthIndex =
        (now.getFullYear() - createdAt.getFullYear()) * 12 +
        (now.getMonth() - createdAt.getMonth());
      if (monthIndex >= 0 && monthIndex < 12) {
        months[11 - monthIndex]++;
      }
    });

    return { labels, data: months };
  };

  const getBidDistribution = () => {
    const ranges = { '0-50': 0, '51-100': 0, '101-200': 0, '201+': 0 };
    filteredItems.forEach((item) => {
      const bid = item.startingPrice || item.price || 0;
      if (bid <= 50) ranges['0-50']++;
      else if (bid <= 100) ranges['51-100']++;
      else if (bid <= 200) ranges['101-200']++;
      else ranges['201+']++;
    });
    return {
      labels: Object.keys(ranges),
      data: Object.values(ranges)
    };
  };

  const statusCounts = getItemStatusCounts();
  const barChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Item Status',
        data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected],
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
        borderColor: ['#FFCE56', '#36A2EB', '#FF6384'],
        borderWidth: 1
      }
    ]
  };

  const itemsByMonth = getItemsByMonth();
  const lineChartData = {
    labels: itemsByMonth.labels,
    datasets: [
      {
        label: 'Items Listed',
        data: itemsByMonth.data,
        fill: false,
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        tension: 0.1
      }
    ]
  };

  const bidDistribution = getBidDistribution();
  const pieChartData = {
    labels: bidDistribution.labels,
    datasets: [
      {
        label: 'Starting Bid Distribution',
        data: bidDistribution.data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderColor: ['#FFFFFF'],
        borderWidth: 1
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Item Status Distribution' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  const lineChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Items Listed Over Time' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Starting Bid Distribution ($)' } }
  };

  const toggleChart = (chart) => {
    setVisibleCharts((prev) => ({ ...prev, [chart]: !prev[chart] }));
  };

  const handleAddItemClick = () => navigate('/add-item');
  const handleDashboardClick = () => navigate('/seller-dashboard');
  const handleItemRefresh = () => fetchSellerItems();

  return (
    <div className="seller-profile-page">
      {/* Hero Section */}
      <section className="seller-profile-hero-section">
        <div className="seller-profile-hero-content">
          <h1 className="seller-profile-hero-title">Seller Profile</h1>
          <p className="seller-profile-hero-subtitle">Manage your listed items and view analytics</p>
        </div>
      </section>

      {/* Charts Section */}
      <section className="seller-charts-section">
        <h2 className="seller-profile-section-title">Analytics Overview</h2>
        <div className="seller-chart-controls">
          <div className="seller-chart-toggles">
            <label>
              <input
                type="checkbox"
                checked={visibleCharts.status}
                onChange={() => toggleChart('status')}
              />
              Status Chart
            </label>
            <label>
              <input
                type="checkbox"
                checked={visibleCharts.timeline}
                onChange={() => toggleChart('timeline')}
              />
              Timeline Chart
            </label>
            <label>
              <input
                type="checkbox"
                checked={visibleCharts.bids}
                onChange={() => toggleChart('bids')}
              />
              Bids Chart
            </label>
          </div>
          <div className="seller-chart-filters">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="365days">Last Year</option>
            </select>
          </div>
        </div>

        <div className="seller-charts-grid">
          {visibleCharts.status && (
            <div className="seller-chart-card">
              <div className="seller-chart-header">
                <h3>Item Status Distribution</h3>
              </div>
              <div className="seller-chart-container">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          )}
          {visibleCharts.timeline && (
            <div className="seller-chart-card">
              <div className="seller-chart-header">
                <h3>Items Listed Over Time</h3>
              </div>
              <div className="seller-chart-container">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          )}
          {visibleCharts.bids && (
            <div className="seller-chart-card">
              <div className="seller-chart-header">
                <h3>Starting Bid Distribution</h3>
              </div>
              <div className="seller-chart-container">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="seller-profile-actions-section">
        <h2 className="seller-profile-section-title">Quick Actions</h2>
        <div className="seller-profile-actions-grid">
          <div className="seller-profile-action-card" onClick={handleAddItemClick}>
            <div className="seller-action-icon-container">
              <i className="seller-action-icon fas fa-plus"></i>
            </div>
            <h3>Add New Item</h3>
          </div>
          <div className="seller-profile-action-card" onClick={handleDashboardClick}>
            <div className="seller-action-icon-container">
              <i className="seller-action-icon fas fa-tachometer-alt"></i>
            </div>
            <h3>View Dashboard</h3>
          </div>
          <div className="seller-profile-action-card" onClick={() => navigate('/items-gallery')}>
            <div className="seller-action-icon-container">
              <i className="seller-action-icon fas fa-images"></i>
            </div>
            <h3>View Gallery</h3>
          </div>
        </div>
      </section>

      {/* Listed Items */}
      <section className="seller-items-section">
        <div className="seller-section-header">
          <h2 className="seller-profile-section-title">Your Listed Items</h2>
          <button className="seller-view-all-btn" onClick={handleDashboardClick}>
            View All
          </button>
        </div>
        <div className="seller-items-grid">
          {filteredItems.length === 0 ? (
            <p className="seller-no-items">No items listed yet.</p>
          ) : (
            filteredItems.slice(0, 3).map((item) => (
              <div key={item._id} className="seller-item-grid-cell">
                <Item item={item} onRefresh={handleItemRefresh} />
              </div>
            ))
          )}
        </div>
      </section>
      <br />
      <br />
      <br />
    </div>
  );
};

export default SellerProfile;
