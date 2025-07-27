const Item = require("../Model/ItemModel");
const fs = require("fs");
const path = require("path");

// ✅ Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get item by ID
const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get items by Seller username
const getItemsBySeller = async (req, res) => {
  const { username } = req.params;
  try {
    const items = await Item.find({
      username,
      isDeletedBySeller: { $ne: true }, // 🔥 Filter out deleted items
    }).sort({ createdAt: -1 });

    res.status(200).json({ item: items });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ Add item
const addItem = async (req, res) => {
  const {
    username,
    id,
    name,
    description,
    price,
    startingPrice,
    biddingEndTime,
    condition,
    provenance,
    dimensions,
    weight,
    material,
    maker,
    year,
    authenticity,
    inspectionNotes,
    inspectionStatus,
    status,
  } = req.body;

  const image = req.files?.image?.[0]?.filename
    ? `/uploads/${req.files.image[0].filename}`
    : "/uploads/placeholder.png";

  const additionalImages = req.files?.additionalImages
    ? req.files.additionalImages.map((file) => `/uploads/${file.filename}`)
    : [];

  const item = new Item({
    username,
    id,
    name,
    description,
    price,
    startingPrice: startingPrice || price,
    biddingEndTime: biddingEndTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    condition,
    provenance,
    dimensions,
    weight,
    material,
    maker,
    year,
    authenticity,
    inspectionNotes,
    inspectionStatus: inspectionStatus || "Pending",
    status: status || "Pending",
    image,
    additionalImages,
  });

  try {
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Block update if inspectionStatus is Approved
    if (item.inspectionStatus === "Approved") {
      return res.status(403).json({
        message: "This item has been approved and cannot be edited anymore.",
      });
    }

    const {
      name,
      description,
      price,
      startingPrice,
      biddingEndTime,
      condition,
      provenance,
      dimensions,
      weight,
      material,
      maker,
      year,
      authenticity,
      inspectionNotes,
      inspectionStatus,
      status,
    } = req.body;

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.startingPrice = startingPrice || item.startingPrice;
    item.biddingEndTime = biddingEndTime || item.biddingEndTime;
    item.condition = condition || item.condition;
    item.provenance = provenance || item.provenance;
    item.dimensions = dimensions || item.dimensions;
    item.weight = weight || item.weight;
    item.material = material || item.material;
    item.maker = maker || item.maker;
    item.year = year || item.year;
    item.authenticity = authenticity || item.authenticity;
    item.inspectionNotes = inspectionNotes || item.inspectionNotes;
    item.inspectionStatus = inspectionStatus || item.inspectionStatus;
    item.status = inspectionStatus === "Approved" ? "Approved" : status || item.status;

    if (req.files?.image?.[0]) {
      if (item.image && item.image !== "/uploads/placeholder.png") {
        const oldPath = path.join(__dirname, "..", item.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      item.image = `/uploads/${req.files.image[0].filename}`;
    }

    if (req.files?.additionalImages?.length > 0) {
      item.additionalImages.forEach((imgPath) => {
        const imgFile = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(imgFile)) fs.unlinkSync(imgFile);
      });
      item.additionalImages = req.files.additionalImages.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};




// ✅ Seller-side soft delete
const deleteItemBySeller = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.isDeletedBySeller = true;
    await item.save();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};

// ✅ Delete item
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.image && item.image !== "/uploads/placeholder.png") {
      const imgPath = path.join(__dirname, "..", item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    item.additionalImages.forEach((img) => {
      const imgPath = path.join(__dirname, "..", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};


// ✅ Update item status (inspection approval/rejection)
const updateItemStatus = async (req, res) => {
  const { id } = req.params;
  const { status, inspectionStatus } = req.body;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (status) item.status = status;
    if (inspectionStatus) {
      item.inspectionStatus = inspectionStatus;
      item.status = inspectionStatus === "Approved" ? "Approved" : "Pending";
    }

    await item.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};



module.exports = {
  getAllItems,
  getItemById,
  getItemsBySeller,
  addItem,
  updateItem,
  deleteItem,
  deleteItemBySeller,
  updateItemStatus,
  
};
