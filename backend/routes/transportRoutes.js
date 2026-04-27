const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User");
const Equipment = require("../models/Equipment");
const TransportRequest = require("../models/TransportRequest");
const upload = require("../middleware/upload");
const Rental = require("../models/Rental");

// GET ALL TRANSPORT HELPERS
router.get("/", async (req, res) => {
  try {
    const helpers = await User.find({ role: "transport" });
    res.json(helpers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* GET REQUESTS FOR HELPER */
router.get("/my-requests/:helperId", async (req, res) => {
  try {
    const requests = await TransportRequest.find({
      helper: req.params.helperId,
    })
      .populate("farmer", "name phone")
      .populate("equipment", "name location") // ✅ FIXED
      .populate("owner", "name");

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* CREATE TRANSPORT REQUEST (FARMER FLOW) */
router.post("/request", async (req, res) => {
  try {
    const {
      helperId,
      farmerId,
      equipmentId,
      rentalId,
      deliveryLocation,
    } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    const rental = await Rental.findById(rentalId);

    if (!equipment || !rental) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const transport = await TransportRequest.create({
      helper: helperId,
      farmer: farmerId,
      owner: rental.owner,
      equipment: equipmentId,
      rental: rentalId,

      // ✅ FIXED
      pickupLocation: equipment.location,
      deliveryLocation: deliveryLocation || "Contact farmer",

      transportDate: new Date(),
      status: "pending",
    });

    await Rental.findByIdAndUpdate(rentalId, {
      transportStatus: "pending",
    });

    res.json(transport);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE STATUS */
router.put("/update-status/:requestId", async (req, res) => {
  try {
    const { status } = req.body;

    const request = await TransportRequest.findById(req.params.requestId);

    request.status = status;
    await request.save();

    await Rental.findByIdAndUpdate(request.rental, {
      transportStatus: status === "approved" ? "approved" : "rejected",
      transport: status === "approved" ? request.helper : null,
    });

    res.json(request);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;