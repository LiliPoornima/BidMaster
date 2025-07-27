const BidFeedbackUserModel = require("../Model/BidFeedbackUserModel");

const getAllBidFeedbackUsers = async (req, res, next) => {
  let bidFeedbackUsers;
  try {
    bidFeedbackUsers = await BidFeedbackUserModel.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error finding feedback entries" });
  }
  if (!bidFeedbackUsers || bidFeedbackUsers.length === 0) {
    return res.status(404).json({ message: "No feedback entries found" });
  }
  return res.status(200).json({ bidFeedbackUsers });
};

const createBidFeedbackUsers = async (req, res, next) => {
  const bidFeedbackUserData = Array.isArray(req.body) ? req.body : [req.body];
  let createdBidFeedbackUsers = [];
  try {
    for (const data of bidFeedbackUserData) {
      const { name, rating, feedback } = data;
      if (!name || !rating || !feedback) {
        return res.status(400).json({ message: "Name, rating, and feedback are required" });
      }
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      const newBidFeedbackUser = new BidFeedbackUserModel({ name, rating, feedback });
      await newBidFeedbackUser.save();
      createdBidFeedbackUsers.push(newBidFeedbackUser);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error adding feedback entries" });
  }
  if (createdBidFeedbackUsers.length === 0) {
    return res.status(404).json({ message: "Unable to add feedback entries" });
  }
  return res.status(200).json({ bidFeedbackUsers: createdBidFeedbackUsers });
};

const getBidFeedbackUserById = async (req, res, next) => {
  const bidFeedbackUserId = req.params.id;
  let bidFeedbackUser;
  try {
    bidFeedbackUser = await BidFeedbackUserModel.findById(bidFeedbackUserId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error finding feedback entry" });
  }
  if (!bidFeedbackUser) {
    return res.status(404).json({ message: "Feedback entry not found" });
  }
  return res.status(200).json({ bidFeedbackUser });
};

const updateBidFeedbackUser = async (req, res, next) => {
  const bidFeedbackUserId = req.params.id;
  const { name, rating, feedback } = req.body;
  let updatedBidFeedbackUser;
  try {
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    updatedBidFeedbackUser = await BidFeedbackUserModel.findByIdAndUpdate(
      bidFeedbackUserId,
      { name, rating, feedback },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating feedback entry" });
  }
  if (!updatedBidFeedbackUser) {
    return res.status(404).json({ message: "Unable to update feedback entry" });
  }
  return res.status(200).json({ bidFeedbackUser: updatedBidFeedbackUser });
};

const deleteBidFeedbackUser = async (req, res, next) => {
  const bidFeedbackUserId = req.params.id;
  let deletedBidFeedbackUser;
  try {
    deletedBidFeedbackUser = await BidFeedbackUserModel.findByIdAndDelete(bidFeedbackUserId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting feedback entry" });
  }
  if (!deletedBidFeedbackUser) {
    return res.status(404).json({ message: "Unable to delete feedback entry" });
  }
  return res.status(200).json({ bidFeedbackUser: deletedBidFeedbackUser });
};

module.exports = {
  getAllBidFeedbackUsers,
  createBidFeedbackUsers,
  getBidFeedbackUserById,
  updateBidFeedbackUser,
  deleteBidFeedbackUser,
};