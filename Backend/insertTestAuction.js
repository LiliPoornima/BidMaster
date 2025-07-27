require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const Auction = require('./Model/AuctionModel');
const BidNowModel = require('./Model/BidNowModel');
const User = require('./Model/UserModel');

async function insertTestData() {
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. Create a test user (if not exists)
  let user = await User.findOne({ email: 'testwinner@example.com' });
  if (!user) {
    user = await User.create({
      name: 'Test Winner',
      email: 'testwinner@example.com',
      username: 'testwinner',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      phone: '1234567890'
      // add any other required fields for your User model
    });
    console.log('Test user created:', user._id);
  }

  // 2. Create a test auction
  const auctionId = new ObjectId("6820e307b35b288000d159ec"); // Use your desired ObjectId
  let auction = await Auction.findById(auctionId);
  if (!auction) {
    auction = await Auction.create({
      _id: auctionId,
      name: 'Test Auction',
      biddingEndTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes in the past
      winnerNotified: false,
      status: 'Approved',
      startingPrice: 1000,
      // add any other required fields for your Auction model
    });
    console.log('Test auction created:', auction._id);
  }

  // 3. Create a test bid
  let bid = await BidNowModel.findOne({ itemId: auctionId, userId: user._id });
  if (!bid) {
    bid = await BidNowModel.create({
      itemId: auctionId,
      userId: user._id,
      bidAmount: 45000,
      isHighestBid: true,
      bidTimestamp: new Date(),
      // add any other required fields for your BidNowModel
    });
    console.log('Test bid created:', bid._id);
  }

  console.log('Test data inserted successfully!');
  await mongoose.connection.close();
}

insertTestData().catch(err => {
  console.error('Error inserting test data:', err);
  mongoose.connection.close();
});
