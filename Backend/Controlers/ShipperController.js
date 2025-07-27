const Shipper = require("../Model/ShipperModel");
const Shipment = require("../Model/ShipmentModel");


// ✅ Add courier
const addCourier = async (req, res) => {
  const { providerid, companyname, contactnumber, rateperkg, companytype } = req.body;
  try {
    const courier = new Shipper({
      providerid,
      companyname,
      contactnumber,
      rateperkg,
      companytype,
    });
    await courier.save();
    res.status(201).json(courier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all couriers
const getAllCouriers = async (req, res) => {
  try {
    const couriers = await Shipper.find();
    res.status(200).json(couriers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete courier
const deleteCourier = async (req, res) => {
  const { id } = req.params;
  try {
    const courier = await Shipper.findByIdAndDelete(id);
    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }
    res.status(200).json({ message: "Courier deleted", courier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update courier
const updateCourier = async (req, res) => {
  const { id } = req.params;
  const { providerid, companyname, contactnumber, rateperkg, companytype } = req.body;

  try {
    const updated = await Shipper.findByIdAndUpdate(
      id,
      { providerid, companyname, contactnumber, rateperkg, companytype },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Courier not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalCouriers = await Shipper.countDocuments();
    const totalPending = await Shipment.countDocuments({ status: "Pending" });
    const totalDelivered = await Shipment.countDocuments({ status: "Delivered" });

    res.status(200).json({
      totalCouriers,
      totalPending,
      totalDelivered,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addCourier,
  getAllCouriers,
  deleteCourier,
  updateCourier,
  getDashboardStats,
};
