const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  startingPrice: Number,
  biddingEndTime: String,
  condition: String,
  provenance: String,
  dimensions: String,
  weight: String,
  material: String,
  maker: String,
  year: String,
  image: String,
  additionalImages: [String],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  username: {    
    type: String,  
    required: true,
}
}, { timestamps: true });

module.exports = mongoose.model('SellerItem', itemSchema);
