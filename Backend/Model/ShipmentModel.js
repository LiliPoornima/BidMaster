const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  itemid: String,
  itemname: String,
  from: String,
  to: String,
  buyername: String,
  buyeremail: String,
  buyerphone: String,
  weight: Number,
  shipmenttype: String,
  status: { type: String, default: 'Pending' },
  purpose: { type: String, default: 'To Buyer' },
  courierToBuyer: String,
 

}, { timestamps: true });

module.exports = mongoose.model('ShipmentModel', shipmentSchema);
