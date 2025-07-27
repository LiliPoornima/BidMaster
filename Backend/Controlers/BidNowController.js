const BidNowModel = require('../Model/BidNowModel');
const { sendOutbidNotification } = require('../utils/emailNotifications');

// Create a new bid
const createBid = async (req, res) => {
    try {
        const { itemId, userId, bidAmount } = req.body;
        
        // Check if bid amount is valid
        const currentHighestBid = await BidNowModel.findOne({ itemId, isHighestBid: true });
        if (currentHighestBid && bidAmount <= currentHighestBid.bidAmount) {
            return res.status(400).json({ message: 'Bid amount must be higher than current highest bid' });
        }
        
        // Notify the previous highest bidder (if not the same user)
        if (currentHighestBid && currentHighestBid.userId !== userId) {
            // Find the previous highest bidder's user info
            const User = require('../Model/UserModel');
            const outbidUser = await User.findById(currentHighestBid.userId);
            if (outbidUser && outbidUser.email) {
                await sendOutbidNotification(outbidUser, 'Auction Item', bidAmount);
            }
        }
        
        // Update previous highest bid status
        if (currentHighestBid) {
            currentHighestBid.isHighestBid = false;
            await currentHighestBid.save();
        }
        
        // Create new bid
        const newBid = new BidNowModel({
            itemId,
            userId,
            bidAmount,
            isHighestBid: true
        });
        
        await newBid.save();
        res.status(201).json(newBid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all bids for an item
const getBidsByItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const bids = await BidNowModel.find({ itemId })
            .sort({ bidAmount: -1 });
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's bid history
const getUserBids = async (req, res) => {
    try {
        const { userId } = req.params;
        const bids = await BidNowModel.find({ userId })
            .sort({ bidTimestamp: -1 });
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current highest bid for an item
const getHighestBid = async (req, res) => {
    try {
        const { itemId } = req.params;
        const highestBid = await BidNowModel.findOne({ itemId, isHighestBid: true });
        res.status(200).json(highestBid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update bid status
const updateBidStatus = async (req, res) => {
    try {
        const { bidId } = req.params;
        const { bidStatus } = req.body;
        
        const updatedBid = await BidNowModel.findByIdAndUpdate(
            bidId,
            { bidStatus },
            { new: true }
        );
        
        if (!updatedBid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        
        res.status(200).json(updatedBid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a bid (retrieve bid)
const deleteBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        // Try to get userId from body, query, or headers
        const userId = req.body.userId || req.query.userId || req.headers['x-user-id'];
        const itemId = req.body.itemId || req.query.itemId;
        
        if (!userId) return res.status(400).json({ message: "User ID required" });
        if (!itemId) return res.status(400).json({ message: "Item ID required" });
        
        const bid = await BidNowModel.findById(bidId);
        if (!bid) return res.status(404).json({ message: "Bid not found" });
        if (bid.userId !== userId) return res.status(403).json({ message: "You can only retrieve your own bids" });
        
        // Check if this is the highest bid
        const isHighestBid = bid.isHighestBid;
        
        // Delete the bid
        await BidNowModel.findByIdAndDelete(bidId);
        
        // If this was the highest bid, update the next highest bid
        if (isHighestBid) {
            // Find the next highest bid for this item
            const nextHighestBid = await BidNowModel.find({ itemId })
                .sort({ bidAmount: -1 })
                .limit(1);
            
            if (nextHighestBid && nextHighestBid.length > 0) {
                // Set the next highest bid as the current highest
                nextHighestBid[0].isHighestBid = true;
                await nextHighestBid[0].save();
            }
        }
        
        res.status(200).json({ 
            message: "Bid retrieved successfully",
            nextHighestBid: nextHighestBid && nextHighestBid.length > 0 ? nextHighestBid[0] : null
        });
    } catch (error) {
        console.error("Error in deleteBid:", error);
        res.status(500).json({ message: "Failed to retrieve bid" });
    }
};

const getUserBidStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const bids = await BidNowModel.find({ userId });

    const totalBids = bids.length;
    const wonAuctions = bids.filter(bid => bid.isWinner).length; // Adjust this logic if you track winners differently
    const averageBidAmount = totalBids ? (bids.reduce((sum, bid) => sum + bid.bidAmount, 0) / totalBids) : 0;
    const successRate = totalBids ? (wonAuctions / totalBids) * 100 : 0;

    res.json({ totalBids, wonAuctions, successRate, averageBidAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createBid,
    getBidsByItem,
    getUserBids,
    getHighestBid,
    updateBidStatus,
    deleteBid,
    getUserBidStats
};