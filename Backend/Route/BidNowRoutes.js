const express = require('express');
const router = express.Router();
const { createBid, getBidsByItem, getUserBids, getHighestBid, updateBidStatus, deleteBid, getUserBidStats } = require('../Controlers/BidNowController');
const mongoose = require('mongoose');
const BidNowModel = require('../Model/BidNowModel');
const Bid = require('../Model/BidNowModel'); // Adjust path if needed

// create a new bid
router.post('/', async (req, res) => {
  try {
    const { itemId, userId, bidAmount } = req.body;
    if (!itemId || !userId || !bidAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newBid = new Bid({ itemId, userId, bidAmount, bidTimestamp: new Date() });
    await newBid.save();
    res.status(201).json(newBid);
  } catch (err) {
    console.error('Bid error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get all bids for a specific item
router.get('/item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const bids = await Bid.find({ itemId }).sort({ bidAmount: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// get all bids made by a user
router.get('/user/:userId', getUserBids);

// get the highest bid for a specific item
router.get('/highest/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const highestBid = await Bid.findOne({ itemId }).sort({ bidAmount: -1 });
    res.json(highestBid || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// update the status of a specific bid
router.put('/:bidId', updateBidStatus);

// delete a bid
router.delete('/:bidId', async (req, res) => {
  try {
    const { bidId } = req.params;
    await Bid.findByIdAndDelete(bidId);
    res.status(200).json({ message: 'Bid deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// optional: delete bid with additional logic (can be used for restoring bid state)
const deleteBidHandler = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { bidId } = req.params;

        // get user id from body, query, or header
        const userId = req.body.userId || req.query.userId || req.headers['x-user-id'];
        if (!userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "user id required" });
        }

        // find the bid
        const bid = await BidNowModel.findById(bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "bid not found" });
        }

        // check if user is the owner of the bid
        if (bid.userId !== userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "you can only retrieve your own bids" });
        }

        const itemId = bid.itemId;

        // delete the bid
        await BidNowModel.findByIdAndDelete(bidId).session(session);

        // reset all bids for this item to not be highest
        await BidNowModel.updateMany({ itemId }, { isHighestBid: false }).session(session);

        // find the next highest bid and mark it as highest
        const nextHighestBid = await BidNowModel.findOne({ itemId }).sort({ bidAmount: -1 }).session(session);
        if (nextHighestBid) {
            nextHighestBid.isHighestBid = true;
            await nextHighestBid.save({ session });
        }

        // commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "bid retrieved successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "failed to retrieve bid" });
    }
};

// get bidding statistics for a user
router.get('/stats/:userId', getUserBidStats);

module.exports = router;