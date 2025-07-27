const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  biddingEndTime: { type: Date, required: true },
  winnerNotified: { type: Boolean, default:false },
  
});

module.exports = mongoose.model('Auction', auctionSchema, 'items');// auctionSchema
