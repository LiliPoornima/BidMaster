const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    username: { type: String, required: true }, // Seller username

    id: { type: String }, // Optional item ID

    name: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    startingPrice: { type: Number, default: 0 },

    biddingEndTime: { type: Date },

    image: { type: String, default: "/uploads/placeholder.png" },
    additionalImages: { type: [String], default: [] },

    status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
    inspectionStatus: { type: String, default: "Pending" }, // Pending, Approved, Rejected

    // Item details
    condition: { type: String, default: "Excellent" },
    provenance: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    weight: { type: String, default: "" },
    material: { type: String, default: "" },
    maker: { type: String, default: "" },
    year: { type: String, default: "" },
    isDeletedBySeller: { type: Boolean, default: false },


    authenticity: { type: String, default: "Verified" },
    inspectionNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItemModel", itemSchema);
