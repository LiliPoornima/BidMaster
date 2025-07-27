const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidFeedbackUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, //rating
    max: 5,
  },
  feedback: {
    type: String,
    required: true,
  },
  createdAt: { //timestamp for feedback submission
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BidFeedbackUser", bidFeedbackUserSchema);