const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true, required: true },
  bio: String,
  phone: String,
  location: String,
  website: String,
  profilePicture: String,
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model('SellerModel', SellerSchema);
