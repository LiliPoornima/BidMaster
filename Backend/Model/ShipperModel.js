const mongoose = require("mongoose");

const shipperSchema = new mongoose.Schema({
    providerid: { type: String, required: true, unique: true },
    companyname: { type: String, required: true },
    contactnumber: { type: String, required: true },
    rateperkg: { type: Number, required: true },
    companytype: { type: String, required: true }, // Local, National, etc.
}, { timestamps: true });

module.exports = mongoose.model("Shipper", shipperSchema);
