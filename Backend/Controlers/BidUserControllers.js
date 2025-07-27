const BidUserModel = require("../Model/BidUserModel");

const getAllBidUsers = async (req, res, next) => {
  let bidUsers;
  try {
    bidUsers = await BidUserModel.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error finding bid users" });
  }
  if (!bidUsers || bidUsers.length === 0) {
    return res.status(404).json({ message: "No bid users found" });
  }
  return res.status(200).json({ bidUsers });
};

const createBidUsers = async (req, res, next) => {
  const bidUserData = Array.isArray(req.body) ? req.body : [req.body];
  let createdBidUsers = [];
  try {
    for (const data of bidUserData) {
      const {
        name,
        email,
        age,
        gender,
        address,
        phone,
        username,
        password,
      } = data;
      const picture = req.file ? req.file.path : null; // Get file path from multer
      const newBidUser = new BidUserModel({
        name,
        email,
        age,
        gender,
        address,
        phone,
        username,
        password,
        picture,
      });
      await newBidUser.save();
      createdBidUsers.push(newBidUser);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error adding bid users" });
  }
  if (createdBidUsers.length === 0) {
    return res.status(404).json({ message: "Unable to add bid users" });
  }
  return res.status(200).json({ bidUsers: createdBidUsers });
};

const getBidUserById = async (req, res, next) => {
  const bidUserId = req.params.id;
  let bidUser;
  try {
    bidUser = await BidUserModel.findById(bidUserId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error finding bid user" });
  }
  if (!bidUser) {
    return res.status(404).json({ message: "Bid user not found" });
  }
  return res.status(200).json({ bidUser });
};

const updateBidUser = async (req, res, next) => {
  const bidUserId = req.params.id;
  const {
    name,
    email,
    age,
    gender,
    address,
    phone,
    username,
    password,
  } = req.body;
  const picture = req.file ? req.file.path : undefined; 
  let updatedBidUser;
  try {
    const updateData = {
      name,
      email,
      age,
      gender,
      address,
      phone,
      username,
      password,
    };
    if (picture) updateData.picture = picture; //pic
    updatedBidUser = await BidUserModel.findByIdAndUpdate(
      bidUserId,
      updateData,
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating bid user" });
  }
  if (!updatedBidUser) {
    return res.status(404).json({ message: "Unable to update bid user details" });
  }
  return res.status(200).json({ bidUser: updatedBidUser });
};

const deleteBidUser = async (req, res, next) => {
  const bidUserId = req.params.id;
  let deletedBidUser;
  try {
    deletedBidUser = await BidUserModel.findByIdAndDelete(bidUserId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting bid user" });
  }
  if (!deletedBidUser) {
    return res.status(404).json({ message: "Unable to delete bid user" });
  }
  return res.status(200).json({ bidUser: deletedBidUser });
};

module.exports = {
  getAllBidUsers,
  createBidUsers,
  getBidUserById,
  updateBidUser,
  deleteBidUser,
};