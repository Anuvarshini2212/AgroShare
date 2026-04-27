const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  startDate: {
    type: String,
    required: true
  },

  endDate: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  transportResponsibility: {
    type: String,
    enum: ["farmer", "owner"],
    required: true
  },

  // ✅ Transport helper (User reference)
  transport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  paymentStatus: {
  type: String,
  enum: ["pending", "paid"],
  default: "pending"
},
paymentId: String,
// ✅ Transport status tracking
transportStatus: {
  type: String,
  enum: ["none", "pending", "approved", "rejected"],
  default: "none"
},

rating: {
  type: Number,
  default: null
},
paymentMethod: {
  type: String,
  enum: ["COD", "ONLINE",null],
  default: null
},
}, { timestamps: true });


module.exports = mongoose.model("Rental", rentalSchema);