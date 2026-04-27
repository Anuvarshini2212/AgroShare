const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: String, 

    role: {
      type: String,
      enum: ["farmer", "owner", "transport", "admin"],
      default: "farmer" 
    },

    // Transport Fields 
    vehicleType: String,
    vehicleNumber: String,
    pricePerKm: Number,
    location: String,
    availableFrom: Date,
    availableTill: Date,
    profilePic: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);