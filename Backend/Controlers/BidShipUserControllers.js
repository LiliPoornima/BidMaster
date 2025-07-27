const BidShipUserModel = require("../Model/BidShipModel");

const getAllBidShipUsers = async (req, res, next) => {
  let bidShipUsers;
  try {
    bidShipUsers = await BidShipUserModel.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error finding bid ship users" });
  }
  if (!bidShipUsers || bidShipUsers.length === 0) {
    return res.status(404).json({ message: "No bid ship users found" });
  }
  return res.status(200).json({ bidShipUsers });
};

const createBidShipUsers = async (req, res, next) => {
  const bidShipUserData = Array.isArray(req.body) ? req.body : [req.body];
  let createdBidShipUsers = [];
  try {
    for (const data of bidShipUserData) {
      const { fullname, email, age, mobileNo, shippingAddress, postalCode, country } = data;
      const newBidShipUser = new BidShipUserModel({
        fullname,
        email,
        age,
        mobileNo,
        shippingAddress,
        postalCode,
        country,
      });
      await newBidShipUser.save();
      createdBidShipUsers.push(newBidShipUser);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error adding bid ship users" });
  }
  if (createdBidShipUsers.length === 0) {
    return res.status(404).json({ message: "Unable to add bid ship users" });
  }
  return res.status(200).json({ bidShipUsers: createdBidShipUsers });
};

const getBidShipUserById = async (req, res, next) => {
  const bidShipUserId = req.params.id;
  let bidShipUser;
  try {
    bidShipUser = await BidShipUserModel.findById(bidShipUserId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error finding bid ship user" });
  }
  if (!bidShipUser) {
    return res.status(404).json({ message: "Bid ship user not found" });
  }
  return res.status(200).json({ bidShipUser });
};

const updateBidShipUser = async (req, res, next) => {
  const bidShipUserId = req.params.id;
  const { fullname, email, age, mobileNo, shippingAddress, postalCode, country } = req.body;
  let updatedBidShipUser;
  try {
    updatedBidShipUser = await BidShipUserModel.findByIdAndUpdate(
      bidShipUserId,
      { fullname, email, age, mobileNo, shippingAddress, postalCode, country },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating bid ship user" });
  }
  if (!updatedBidShipUser) {
    return res.status(404).json({ message: "Unable to update bid ship user details" });
  }
  return res.status(200).json({ bidShipUser: updatedBidShipUser });
};

const deleteBidShipUser = async (req, res, next) => {
  const bidShipUserId = req.params.id;
  let deletedBidShipUser;
  try {
    deletedBidShipUser = await BidShipUserModel.findByIdAndDelete(bidShipUserId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting bid ship user" });
  }
  if (!deletedBidShipUser) {
    return res.status(404).json({ message: "Unable to delete bid ship user" });
  }
  return res.status(200).json({ bidShipUser: deletedBidShipUser });
};

module.exports = {
  getAllBidShipUsers,
  createBidShipUsers,
  getBidShipUserById,
  updateBidShipUser,
  deleteBidShipUser,
};