const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: String,
  category: String,
  pricePerDay: Number,
  location: String,
  image: String,
  availableDate: String,
  rating: { type: Number, default: 0 },
 owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required
  : false
}

});

module.exports = mongoose.model("Equipment", equipmentSchema);
