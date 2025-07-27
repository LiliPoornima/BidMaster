const Shipment = require("../Model/ShipmentModel");
const Shipper = require("../Model/ShipperModel");
const nodemailer = require("nodemailer");

// ✅ Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Email sender function
const sendNotification = async (email, subject, message) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message,
  });
};

// ✅ Create shipment (from center to buyer)
const createShipment = async (req, res) => {
  const {
    itemid,
    itemname,
    from,
    to,
    buyername,
    buyeremail,
    buyerphone,
    weight,
    shipmenttype,
  } = req.body;

  try {
    const shipment = new Shipment({
      itemid,
      itemname,
      from,
      to,
      buyername,
      buyeremail,
      buyerphone,
      weight,
      shipmenttype,
      status: "Pending",
    });

    await shipment.save();

    // ✅ Try email notification separately
    try {
      await sendNotification(
        buyeremail,
        "Shipment Created",
        `Your shipment for item "${itemname}" is being processed.`
      );
    } catch (emailErr) {
      console.error("📧 Email sending failed:", emailErr.message);
    }

    res.status(201).json(shipment); // ✅ Always return 201 if save succeeded
  } catch (err) {
    console.error("🚨 Shipment creation failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get all shipments
const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.status(200).json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get shipments by user email (only buyer side now)
const getUserShipments = async (req, res) => {
  const { email } = req.params;
  try {
    const shipments = await Shipment.find({
      buyeremail: email,
    });
    res.status(200).json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get shipment by ID
const getShipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update shipment status or assign courier
const updateShipmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, courierToBuyer } = req.body;

  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    if (status) shipment.status = status;
    if (courierToBuyer) shipment.courierToBuyer = courierToBuyer;

    if (courierToBuyer) {
      const courier = await Shipper.findOne({ companyname: courierToBuyer });

      if (!courier) {
        return res.status(404).json({ message: "Courier not found" });
      }

      shipment.cost += shipment.weight * courier.rateperkg;
    }

    await shipment.save();

    // ✅ Try to send email but don't fail the response if it errors
    try {
      await sendNotification(
        shipment.buyeremail,
        `Shipment "${shipment.itemname}" Update`,
        `Shipment status is now "${shipment.status}".`
      );
    } catch (emailErr) {
      console.error("📧 Email sending failed:", emailErr.message);
      // You can log this or even notify frontend separately if needed
    }

    res.status(200).json(shipment); // ✅ Always send 200 if save worked
  } catch (err) {
    console.error("🚨 Error updating shipment status:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update shipment (full fields)
const updateShipment = async (req, res) => {
  const { id } = req.params;
  const {
    itemid,
    itemname,
    to,
    buyername,
    buyeremail,
    buyerphone,
    weight,
    shipmenttype,
    status,
  } = req.body;

  try {
    const updatedShipment = await Shipment.findByIdAndUpdate(
      id,
      {
        itemid,
        itemname,
        to,
        buyername,
        buyeremail,
        buyerphone,
        weight,
        shipmenttype,
        status,
      },
      { new: true }
    );

    if (!updatedShipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.status(200).json(updatedShipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete shipment
const deleteShipment = async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await Shipment.findByIdAndDelete(id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json({ message: "Shipment deleted", shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Assign courier to buyer delivery
const assignCourier = async (req, res) => {
  const { id } = req.params;
  const { courierName } = req.body;

  try {
    const updatedShipment = await Shipment.findByIdAndUpdate(
      id,
      { $set: { courierToBuyer: courierName } },
      { new: true }
    );

    if (!updatedShipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.status(200).json(updatedShipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getShipmentsByUserEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const shipments = await Shipment.find({
      buyeremail: { $regex: `^${email}$`, $options: 'i' }
    });

    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching shipments by user email:', error);
    res.status(500).json({ message: 'Server error fetching shipments' });
  }
};



module.exports = {
  createShipment,
  getAllShipments,
  getUserShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
  assignCourier,
  updateShipment,
  getShipmentsByUserEmail,
};
