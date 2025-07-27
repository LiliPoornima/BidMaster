const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    },
    bidTimestamp: {
        type: Date,
        default: Date.now
    },
    isHighestBid: {
        type: Boolean,
        default: true
    }
});

const Bid = mongoose.model('BidNowModel', bidSchema);

module.exports = Bid;