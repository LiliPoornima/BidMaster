const Seller = require('../Model/SellerModel');

// ✅ Create or Update profile
const updateSellerProfile = async (req, res) => {
  try {
    const userData = JSON.parse(req.body.userData);
    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedData = {
      ...userData,
      ...(profilePic && { profilePicture: profilePic }),
    };

    const seller = await Seller.findOneAndUpdate(
      { email: userData.email }, // Find by email
      updatedData,
      { new: true, upsert: true } // Create if not exist, update if exist
    );

    res.status(200).json({ message: 'Profile saved successfully', seller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};



module.exports = {
  updateSellerProfile,
 
};
