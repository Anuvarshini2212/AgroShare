const mongoose = require("mongoose");

const transportRequestSchema = new mongoose.Schema({
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  rental: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental",
    required: true,
  },

  pickupLocation: String,
  deliveryLocation: String,
  transportDate: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

}, { timestamps: true });

module.exports = mongoose.model("TransportRequest", transportRequestSchema);