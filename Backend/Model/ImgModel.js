const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImgSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  itemId: {
    type: String, 
    required: false, 
  },
});

module.exports = mongoose.model("ImgModel", ImgSchema);