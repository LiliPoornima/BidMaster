const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingShipmentSchema = new Schema({
 // auctionid: { type: String, required: true, unique: true },
  buyerDetails: {
    itemid: { type: String, required: true },
    buyername: { type: String, required: true },
    buyeremail: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    buyerphone: { type: String, required: true },
    to: { type: String, required: true } // Buyer's delivery address
  },
  sellerDetails: {
    itemid: { type: String, required: true },
    itemname: { type: String, required: true },
    userName: { type: String, required: true },
    selleremail: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    phone: { type: String, required: true },
    from: { type: String, required: true }, // Seller's pickup address
    weight: { type: Number, required: true, min: 0 },
    },
  collectionCenter: { type: String, default: 'Main Collection Center' }
}, { timestamps: true });

module.exports = mongoose.model('pendingShipments', pendingShipmentSchema);