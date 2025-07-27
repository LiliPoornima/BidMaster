import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./BidNowBidderStyles.css";

const BidNowBidder = () => {
  const { itemId } = useParams();
  const [currentBid, setCurrentBid] = useState(0);
  const [bidInput, setBidInput] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [outbidAlert, setOutbidAlert] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [isLast15Minutes, setIsLast15Minutes] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [outbidNotification, setOutbidNotification] = useState(false);
  const [showRetrieveConfirmation, setShowRetrieveConfirmation] = useState(false);
  const [bidToRetrieve, setBidToRetrieve] = useState(null);
  const previousHighestBidRef = useRef(null);
  const previousHighestBidderRef = useRef(null);
  const pdfRef = useRef(null); // Added the missing ref
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId') || 'testuser';
  const [bidStats, setBidStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    successRate: 0,
    averageBidAmount: 0
  });


// Function to download PDF using html2canvas & jsPDF
  const downloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 size width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("Auction_Details.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };




  // Countdown timer effect
  useEffect(() => {
    if (!itemDetails?.biddingEndTime) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(itemDetails.biddingEndTime).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      // Check if we're in the last 15 minutes
      setIsLast15Minutes(difference <= 15 * 60 * 1000);

      if (difference <= 0) {
        setAuctionEnded(true);
        // Check if current user won
        if (bidHistory.length > 0 && bidHistory[0].userId === currentUserId) {
          setHasWon(true);
        }
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (!newTimeLeft) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [itemDetails?.biddingEndTime, bidHistory, currentUserId]);

  // Fetch item details and bid data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!itemId) return;

        // Fetch item details
        const itemResponse = await axios.get(`http://localhost:5000/items/${itemId}`);
        setItemDetails(itemResponse.data);

        // Fetch current highest bid
        const bidResponse = await axios.get(`http://localhost:5000/api/bid-now/highest/${itemId}`);
        if (bidResponse.data && bidResponse.data.bidAmount) {
          // Check if we were outbid by another user
          if (previousHighestBidRef.current && 
              previousHighestBidRef.current < bidResponse.data.bidAmount &&
              previousHighestBidderRef.current === currentUserId &&
              bidResponse.data.userId !== currentUserId) { // Only show notification if outbid by another user
            setOutbidNotification(true);
            // Play notification sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(err => console.log('Audio play failed:', err));
          }
          
          setCurrentBid(bidResponse.data.bidAmount);
          previousHighestBidRef.current = bidResponse.data.bidAmount;
          previousHighestBidderRef.current = bidResponse.data.userId;
        } else {
          setCurrentBid(itemResponse.data.startingPrice || itemResponse.data.price);
          previousHighestBidRef.current = itemResponse.data.startingPrice || itemResponse.data.price;
          previousHighestBidderRef.current = null;
        }

        // Fetch bid history
        const historyResponse = await axios.get(`http://localhost:5000/api/bid-now/item/${itemId}`);
        setBidHistory(historyResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    const calculateBidStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bid-now/stats/${currentUserId}`);
        setBidStats(response.data);
      } catch (err) {
        console.error("Error fetching bid statistics:", err);
      }
    };

    fetchData();
    calculateBidStats();
    
    // Set up polling for bid updates
    const pollInterval = setInterval(() => {
      fetchData();
      calculateBidStats();
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(pollInterval);
  }, [itemId, currentUserId]);

  // Clear outbid notification after 5 seconds
  useEffect(() => {
    if (outbidNotification) {
      const timer = setTimeout(() => {
        setOutbidNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [outbidNotification]);

  useEffect(() => {
    if (auctionEnded) {
      notifyWinnerIfNeeded(itemId);
    }
  }, [auctionEnded, itemId]);

  const placeBid = async () => {
    if (auctionEnded) {
      alert("This auction has ended!");
      return;
    }

    const bidValue = parseFloat(bidInput);
    if (bidValue && bidValue > currentBid) {
      try {
        // Place bid in bid system
        const response = await axios.post('http://localhost:5000/api/bid-now', {
          itemId,
          userId: currentUserId,
          bidAmount: bidValue
        });

        setCurrentBid(bidValue);
        setConfirmation(true);
        setOutbidAlert(false);
        setBidInput("");
        
        // Update bid history
        setBidHistory(prev => [...prev, response.data]);

        // Clear confirmation after 3 seconds
        setTimeout(() => setConfirmation(false), 3000);
      } catch (err) {
        console.error("Error placing bid:", err);
        alert("Failed to place bid. Please try again.");
      }
    } else {
      alert("Please enter a bid higher than the current one!");
    }
  };

  const handleRetrieveClick = () => {
    if (isLast15Minutes) {
      alert("Cannot retrieve bid in the last 15 minutes of the auction!");
      return;
    }

    // Find the user's highest bid
    const userBids = bidHistory.filter(bid => bid.userId === currentUserId);
    if (userBids.length === 0) {
      alert("You haven't placed any bids yet!");
      return;
    }

    const highestUserBid = userBids.reduce((prev, current) => 
      prev.bidAmount > current.bidAmount ? prev : current
    );

    setBidToRetrieve(highestUserBid);
    setShowRetrieveConfirmation(true);
  };

  const confirmRetrieveBid = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/bid-now/${bidToRetrieve._id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          userId: currentUserId,
          itemId: itemId
        }
      });

      if (response.status === 200) {
        // Remove the retrieved bid from the history
        const updatedBidHistory = bidHistory.filter(bid => bid._id !== bidToRetrieve._id);
        setBidHistory(updatedBidHistory);
        
        // Find the next highest bid
        if (updatedBidHistory.length > 0) {
          // Sort the bids by amount in descending order
          const sortedBids = [...updatedBidHistory].sort((a, b) => b.bidAmount - a.bidAmount);
          setCurrentBid(sortedBids[0].bidAmount);
        } else {
          // If no bids left, set to starting price
          setCurrentBid(itemDetails.startingPrice || itemDetails.price);
        }
        
        alert("Your bid has been retrieved successfully!");
      } else {
        throw new Error("Failed to retrieve bid");
      }
    } catch (err) {
      console.error("Error retrieving bid:", err);
      if (err.response) {
        alert(err.response.data.message || "Failed to retrieve bid. Please try again.");
      } else if (err.request) {
        alert("No response from server. Please check your internet connection.");
      } else {
        alert("Failed to retrieve bid. Please try again.");
      }
    } finally {
      setShowRetrieveConfirmation(false);
      setBidToRetrieve(null);
    }
  };

  const cancelRetrieveBid = () => {
    setShowRetrieveConfirmation(false);
    setBidToRetrieve(null);
  };

  const handleProceedToPay = () => {
    navigate(`/payment/${itemId}`);
  };

  const formatTimeLeft = () => {
    if (!timeLeft) return "Auction Ended";
    
    const { days, hours, minutes, seconds } = timeLeft;
    const parts = [];
    
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    
    return parts.join(" ");
  };

  const notifyWinnerIfNeeded = async (auctionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/check-end/${auctionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Winner notification response:', data.message);
    } catch (error) {
      console.error('Error notifying winner:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!itemDetails) return <div className="error">Item not found</div>;

  return (
    <div className="BidNowBidderWrapper">
      <div className="BidNowBidderHeader">
        <h1 className="BidNowBidderTitle">Auction Details</h1>
        <button className="downloadPdf-btn" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <div className="BidNowBidderContent" ref={pdfRef}>  
        <main className="BidNowBidderMain">
          <div className="BidNowBidderLeft">
            <h1>{itemDetails.name}</h1>
            <div className="BidNowBidderImageGallery">
              <img
                src={itemDetails.image.startsWith('/uploads')
                  ? `http://localhost:5000${itemDetails.image}`
                  : `https://via.placeholder.com/400?text=${encodeURIComponent(itemDetails.name)}`}
                alt={itemDetails.name}
                className="BidNowBidderZoomable"
              />
            </div>
            <div className="BidNowBidderDescription">
              <h2>Description</h2>
              <p>{itemDetails.description}</p>
            </div>
            
            {/* Bid History Section */}
            <div className="BidNowBidderHistory">
              <h2>Live Auction</h2>
              <div className="BidNowBidderHistoryList">
                {bidHistory.map((bid, index) => (
                  <div 
                    key={index} 
                    className={`BidNowBidderHistoryItem ${bid.userId === currentUserId ? 'your-bid' : ''}`}
                  >
                    <span className="bid-amount">${bid.bidAmount}</span>
                    <span className="bid-user">{bid.userId === currentUserId ? 'You' : 'User ' + bid.userId.slice(-4)}</span>
                    <span className="bid-time">{new Date(bid.bidTimestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="BidNowBidderRight">
            <div className="BidNowBidderPrices">
              <div className="starting-price">
                <h3>Starting Price</h3>
                <p>${parseFloat(itemDetails.startingPrice || itemDetails.price).toFixed(2)}</p>
              </div>
              <div className="current-bid">
                <h3>Current Highest Bid</h3>
                <p>${currentBid.toFixed(2)}</p>
              </div>
            </div>

            <div className="BidNowBidderTimer">
              <h2>Time Remaining</h2>
              <p className={auctionEnded ? 'auction-ended' : ''}>{formatTimeLeft()}</p>
              <p className="end-time">Ends at: {new Date(itemDetails.biddingEndTime).toLocaleString()}</p>
              {isLast15Minutes && !auctionEnded && (
                <p className="warning-message">Last 15 minutes - Bid retrieval disabled</p>
              )}
            </div>

            {!auctionEnded && (
              <div className="BidNowBidderBidForm">
                <input
                  type="number"
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  placeholder="Enter your bid"
                  min={currentBid + 1}
                  step="0.01"
                />
                <button onClick={placeBid}>Place Bid</button>
                {!isLast15Minutes && bidHistory.some(bid => bid.userId === currentUserId) && (
                  <button onClick={handleRetrieveClick} className="retrieve-bid-button">
                    Retrieve My Bid
                  </button>
                )}
                <div className="terms-text">
                  By placing a bid, you agree to our{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Terms and Conditions
                  </a>.
                </div>
              </div>
            )}

            {/* Confirmation Dialog */}
            {showRetrieveConfirmation && (
              <div className="confirmation-dialog-overlay">
                <div className="confirmation-dialog">
                  <h3>Confirm Bid Retrieval</h3>
                  <p>Are you sure you want to retrieve your bid of ${bidToRetrieve?.bidAmount}?</p>
                  <p className="warning-text">This action cannot be undone.</p>
                  <div className="confirmation-buttons">
                    <button onClick={confirmRetrieveBid} className="confirm-button">
                      Yes, Retrieve Bid
                    </button>
                    <button onClick={cancelRetrieveBid} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {confirmation && (
              <div className="confirmation-message">
                Your bid has been placed successfully!
              </div>
            )}
            {outbidNotification && (
              <div className="outbid-notification">
                <div className="outbid-content">
                  <span className="outbid-icon">⚠</span>
                  <p>You have been outbid! Place a higher bid to stay in the auction.</p>
                </div>
              </div>
            )}
            {auctionEnded && (
              <div className="auction-ended-message">
                {hasWon ? (
                  <>
                    <p>Congratulations! You won the auction!</p>
                    <button onClick={handleProceedToPay} className="proceed-to-pay-button">
                      Proceed to Payment
                    </button>
                  </>
                ) : (
                  <p>This auction has ended. Better luck next time!</p>
                )}
              </div>
            )}

            <div className="BidNowBidderStats">
              <h2>Your Bidding Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>Total Bids</h3>
                  <p>{bidStats.totalBids}</p>
                </div>
                <div className="stat-item">
                  <h3>Won Auctions</h3>
                  <p>{bidStats.wonAuctions}</p>
                </div>
                <div className="stat-item">
                  <h3>Success Rate</h3>
                  <p>{bidStats.successRate}%</p>
                </div>
                <div className="stat-item">
                  <h3>Average Bid</h3>
                  <p>${bidStats.averageBidAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div> 
    </div>
  );
};

export default BidNowBidder;