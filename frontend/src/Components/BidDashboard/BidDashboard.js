// BidDashboard.js - Side-by-Side Layout
import React, { useState, useEffect, useRef } from "react";
import "./BidDashboard.css";
import { useNavigate } from "react-router-dom";
import Chart from 'chart.js/auto'; // Make sure to install this: npm install chart.js
import axios from 'axios';

const BidDashboard = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const trendChartRef = useRef(null);
  let chartInstance = null;
  let trendChartInstance = null;

  // State for personal bid history
  const [personalBidHistory, setPersonalBidHistory] = useState([]);
  const [bidStats, setBidStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    activeAuctions: 0,
    averageBidAmount: 0,
    successRate: 0
  });

  // image paths for the carousel
  const images = [
    "/BidImages/shutterstock.jpg",
    "/BidImages/antiq.jpg",
    "/BidImages/tele.jpg",
    "/BidImages/antifurnit.jpg",
    "/BidImages/watch.jpg",
  ];

  // state to control which image is shown
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);

  // state to hold time and date
  const [currentTime, setCurrentTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    period: "AM",
    date: "",
  });

  // auction status
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  // current bid value
  const [currentBid, setCurrentBid] = useState(250);

  // history of previous bids
  const [bidHistory, setBidHistory] = useState([
    { bidder: "Lahiruni", amount: 200, time: "10:00 AM" },
    { bidder: "Durangi", amount: 220, time: "10:05 AM" },
    { bidder: "Poornima", amount: 250, time: "10:10 AM" },
  ]);

  // Fetch personal bid history
  useEffect(() => {
    const fetchPersonalBidHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/personal-bids');
        setPersonalBidHistory(response.data.bids);
        
        // Calculate statistics
        const stats = {
          totalBids: response.data.bids.length,
          wonAuctions: response.data.bids.filter(bid => bid.status === 'won').length,
          activeAuctions: response.data.bids.filter(bid => bid.status === 'active').length,
          averageBidAmount: response.data.bids.reduce((acc, bid) => acc + bid.amount, 0) / response.data.bids.length,
          successRate: (response.data.bids.filter(bid => bid.status === 'won').length / response.data.bids.length) * 100
        };
        setBidStats(stats);
      } catch (error) {
        console.error('Error fetching personal bid history:', error);
      }
    };

    fetchPersonalBidHistory();
  }, []);

  // automatic image transition every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageOpacity(0);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setImageOpacity(1);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // updates the clock and checks auction end time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      hours = String(hours).padStart(2, "0");
      const date = now.toLocaleDateString();

      setCurrentTime({ hours, minutes, seconds, period, date });

      const endTime = new Date("April 1, 2025 12:00:00").getTime();
      if (now.getTime() > endTime) {
        setIsAuctionEnded(true);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize and update the chart
  useEffect(() => {
    if (chartRef.current && bidHistory.length > 0) {
      // Destroy previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Sort bid history by time
      const sortedBids = [...bidHistory].sort((a, b) => {
        const timeA = new Date(`1/1/2025 ${a.time}`);
        const timeB = new Date(`1/1/2025 ${b.time}`);
        return timeA - timeB;
      });
      
      // Extract data for chart
      const labels = sortedBids.map(bid => bid.time);
      const amounts = sortedBids.map(bid => bid.amount);
      const bidders = sortedBids.map(bid => bid.bidder);
      
      // Create gradient for chart
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(75, 123, 236, 0.8)');
      gradient.addColorStop(1, 'rgba(75, 123, 236, 0.1)');
      
      // Create new chart
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Bid Amount ($)',
              data: amounts,
              borderColor: '#4b7bec',
              backgroundColor: gradient,
              borderWidth: 3,
              pointBackgroundColor: '#4b7bec',
              pointBorderColor: '#ffffff',
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  family: 'Poppins',
                  size: 12
                },
                color: '#2d3436'
              }
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(46, 49, 65, 0.9)',
              titleFont: {
                family: 'Poppins',
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                family: 'Poppins',
                size: 13
              },
              padding: 12,
              cornerRadius: 8,
              caretSize: 6,
              callbacks: {
                title: (tooltipItems) => {
                  return `Time: ${tooltipItems[0].label}`;
                },
                label: (context) => {
                  return [
                    `Amount: $${context.raw}`,
                    `Bidder: ${bidders[context.dataIndex]}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: 'Poppins',
                  size: 11
                },
                color: '#7f8fa6'
              }
            },
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  family: 'Poppins',
                  size: 11
                },
                color: '#7f8fa6',
                callback: (value) => {
                  return `$${value}`;
                }
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
    }
    
    // Clean up function to destroy chart when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [bidHistory]);

  // Initialize and update the trend analysis chart
  useEffect(() => {
    if (trendChartRef.current && personalBidHistory.length > 0) {
      if (trendChartInstance) {
        trendChartInstance.destroy();
      }

      const ctx = trendChartRef.current.getContext('2d');
      
      // Process data for trend analysis
      const monthlyData = personalBidHistory.reduce((acc, bid) => {
        const month = new Date(bid.date).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = {
            totalAmount: 0,
            count: 0,
            wonCount: 0
          };
        }
        acc[month].totalAmount += bid.amount;
        acc[month].count++;
        if (bid.status === 'won') acc[month].wonCount++;
        return acc;
      }, {});

      const months = Object.keys(monthlyData);
      const avgBidAmounts = months.map(month => monthlyData[month].totalAmount / monthlyData[month].count);
      const winRates = months.map(month => (monthlyData[month].wonCount / monthlyData[month].count) * 100);

      trendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Average Bid Amount ($)',
              data: avgBidAmounts,
              backgroundColor: 'rgba(75, 123, 236, 0.7)',
              borderColor: 'rgba(75, 123, 236, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Win Rate (%)',
              data: winRates,
              type: 'line',
              borderColor: 'rgba(46, 204, 113, 1)',
              borderWidth: 2,
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monthly Bidding Trends'
            }
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Average Bid Amount ($)'
              }
            },
            y1: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Win Rate (%)'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }

    return () => {
      if (trendChartInstance) {
        trendChartInstance.destroy();
      }
    };
  }, [personalBidHistory]);

  // when button is clicked, show alert and go to items page
  const handleSeeAuctionsClick = () => {
    alert("Redirecting to auctions page...");
    navigate("/items-gallery");
  };

  // Helper to get relative time (e.g., '2 days ago')
  function getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  return (
    <div className="biddashboard-bid-dashboard-container">
      {/* Hidden header, now shown in navigation */}
      <header className="biddashboard-bid-header">
        <h1>Welcome To BidMaster</h1>
        <div className="biddashboard-bid-bidder-info">
          welcome back <span>Poornima</span>
        </div>
      </header>

      <div className="biddashboard-bid-main-content">
        {/* Left Column: Image Carousel */}
        <div className="biddashboard-bid-left-column">
          {/* image carousel */}
          <div className="biddashboard-bid-image-carousel">
            <img
              src={images[currentImageIndex]}
              alt="Auction Item"
              style={{ opacity: imageOpacity, transition: "opacity 0.5s ease" }}
            />
            <div className="biddashboard-bid-image-nav">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`biddashboard-bid-dot ${index === currentImageIndex ? "biddashboard-bid-active" : ""}`}
                  onClick={() => {
                    setImageOpacity(0);
                    setTimeout(() => {
                      setCurrentImageIndex(index);
                      setImageOpacity(1);
                    }, 500);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity - moved here, replacing statistics */}
          <div className="biddashboard-activity-summary">
            <h3>Recent Activity</h3>
            <div className="biddashboard-activity-items">
              {personalBidHistory.length === 0 ? (
                <div style={{ color: '#888', padding: '20px 0' }}>No recent activity.</div>
              ) : (
                personalBidHistory.slice(0, 5).map((bid, idx) => (
                  <div className="biddashboard-activity-item" key={idx}>
                    <div className={`biddashboard-activity-icon ${bid.status}`}></div>
                    <div className="biddashboard-activity-content">
                      <div className="biddashboard-activity-title">{bid.itemName}</div>
                      <div className="biddashboard-activity-details">
                        <span className="biddashboard-activity-amount">${bid.amount}</span>
                        <span className="biddashboard-activity-time">{getRelativeTime(bid.date)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details, Date/Time, and Button */}
        <div className="biddashboard-bid-right-column">
          {/* auction details */}
          <div className="biddashboard-bid-auction-details">
            <h2>Current Auction: Vintage Watch</h2>
            <p>
              A rare vintage watch from 1960, preserved in perfect condition. This exquisite timepiece features a classic design, intricate craftsmanship, and a timeless appeal. Ideal for collectors and watch enthusiasts.
            </p>
            <p>
              Current bid: <span>${currentBid.toFixed(2)}</span>
            </p>
            <p>
              Status: <span>{isAuctionEnded ? "ended" : "live"}</span>
            </p>
          </div>

          {/* date/time and button section */}
          <div className="biddashboard-bid-action-section">
            {/* current date and time */}
            <div className="biddashboard-bid-countdown">
              <h3>Current Date & Time</h3>
              <div className="biddashboard-digital-clock">
                <div className="biddashboard-time">
                  <span>{currentTime.hours}</span>:<span>{currentTime.minutes}</span>:
                  <span>{currentTime.seconds}</span> <span>{currentTime.period}</span>
                </div>
                <div className="biddashboard-date">{currentTime.date}</div>
              </div>
            </div>

            {/* see auctions button */}
            <div className="biddashboard-bid-action-button">
              <button
                className="biddashboard-bid-bid-now-btn"
                onClick={handleSeeAuctionsClick}
              >
                See Auctions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidDashboard;