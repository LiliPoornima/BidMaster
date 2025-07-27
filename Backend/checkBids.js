require('dotenv').config();
const mongoose = require('mongoose');
const Auction = require('./Model/AuctionModel');
const BidNowModel = require('./Model/BidNowModel');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    // Find the test auction
    const auction = await Auction.findOne({ name: 'Test Auction' });
    if (!auction) {
      console.log('Test auction not found');
      return;
    }

    console.log(`\nChecking bids for auction: ${auction.name}`);
    console.log(`Auction ID: ${auction._id}`);

    // Find all bids for this auction
    const bids = await BidNowModel.find({ itemId: auction._id.toString() });
    console.log(`\nTotal bids found: ${bids.length}`);

    if (bids.length > 0) {
      console.log('\nBid details:');
      bids.forEach(bid => {
        console.log(`\nBid amount: $${bid.bidAmount}`);
        console.log(`User ID: ${bid.userId}`);
        console.log(`Timestamp: ${bid.createdAt}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}); 