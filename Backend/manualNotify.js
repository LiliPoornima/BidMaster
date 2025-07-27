require('dotenv').config();
const mongoose = require('mongoose');
const { notifyWinners } = require('./utils/auctionWinnerNotifier');

console.log('Starting manual winner notification process...');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    console.log('Connected to MongoDB');
    await notifyWinners();
    console.log('Winner notification process completed');
  } catch (error) {
    console.error('Error during winner notification:', error);
  } finally {
    mongoose.connection.close();
  }
});
