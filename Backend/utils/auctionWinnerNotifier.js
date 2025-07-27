const cron = require('node-cron');
const mongoose = require('mongoose');
const Auction = require('../Model/AuctionModel');
const BidNowModel = require('../Model/BidNowModel');
const User = require('../Model/UserModel');
const { sendAuctionWinNotification } = require('./emailNotifications');

async function notifyWinners() {
  try {
    console.log('Starting winner notification process...');
    const now = new Date();

    // Find auctions that have ended and haven't notified the winner yet
    const endedAuctions = await Auction.find({
      biddingEndTime: { $lte: now },
      winnerNotified: { $ne: true }
    });

    console.log(`Found ${endedAuctions.length} ended auctions to process`);

    for (const auction of endedAuctions) {
      console.log(`Processing auction: ${auction.name}`);

      // Validate auction data
      if (!auction._id) {
        console.warn(`Skipping auction - invalid ID: ${auction}`);
        continue;
      }

      // Find the highest bid for this auction
      const highestBid = await BidNowModel.findOne({ 
        itemId: auction._id.toString() 
      }).sort({ bidAmount: -1 });

      if (!highestBid) {
        console.log(`No bids found for auction: ${auction.name}`);
        continue;
      }

      console.log(`Highest bid found: $${highestBid.bidAmount}`);

      // Find the user who placed the highest bid
      const winner = await User.findById(highestBid.userId);

      if (!winner) {
        console.warn(`No winner found for bid user ID: ${highestBid.userId}`);
        continue;
      }

      // Validate winner email
      if (!winner.email) {
        console.warn(`Winner has no email: ${winner.name || 'Unknown'}`);
        continue;
      }

      try {
        // Send the winner email
        console.log(`Sending win notification to: ${winner.email}`);
        await sendAuctionWinNotification(
          winner,
          auction.name,
          highestBid.bidAmount
        );

        // Mark the auction as notified
        auction.winnerNotified = true;
        await auction.save();

        console.log(`Successfully notified winner for auction: ${auction.name}`);
      } catch (emailError) {
        console.error(`Failed to send email for auction ${auction.name}:`, emailError);
        // Optionally, you might want to log this failure or handle it differently
      }
    }

    console.log('Winner notification process completed');
  } catch (error) {
    console.error('Critical error in winner notification process:', error);
  }
}

// Run every minute
const winnerNotificationJob = cron.schedule('* * * * *', notifyWinners, {
  scheduled: true,
  timezone: "UTC"
});

// Optionally, export for manual testing or management
module.exports = {
  notifyWinners,
  winnerNotificationJob
};

