require('dotenv').config();
const mongoose = require('mongoose');
const Auction = require('./Model/AuctionModel');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    const result = await Auction.updateOne(
      { _id: mongoose.Types.ObjectId("6820483a391318b0897629b8") },
      { winnerNotified: false }
    );
    console.log('Updated auctions:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}); 