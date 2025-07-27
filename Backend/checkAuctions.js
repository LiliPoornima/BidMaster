require('dotenv').config();
const mongoose = require('mongoose');
const Auction = require('./Model/AuctionModel');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    // Get all auctions
    const auctions = await Auction.find({});
    console.log(`Total auctions in database: ${auctions.length}`);
    
    // Get current time
    const now = new Date();
    console.log('Current time:', now.toISOString());
    
    // Check ended auctions
    const endedAuctions = await Auction.find({
      biddingEndTime: { $lte: now }
    });
    console.log(`\nEnded auctions: ${endedAuctions.length}`);
    endedAuctions.forEach(auction => {
      console.log(`\nAuction: ${auction.name}`);
      console.log(`End time: ${auction.biddingEndTime}`);
      console.log(`Winner notified: ${auction.winnerNotified}`);
    });
    
    // Check active auctions
    const activeAuctions = await Auction.find({
      biddingEndTime: { $gt: now }
    });
    console.log(`\nActive auctions: ${activeAuctions.length}`);
    activeAuctions.forEach(auction => {
      console.log(`\nAuction: ${auction.name}`);
      console.log(`End time: ${auction.biddingEndTime}`);
      console.log(`Winner notified: ${auction.winnerNotified}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}); 