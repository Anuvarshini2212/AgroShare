const express = require("express");
const router = express.Router();
const Rental = require("../models/Rental");
const Equipment = require("../models/Equipment");
const User = require("../models/User");
const TransportRequest = require("../models/TransportRequest");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

/* ============================================
   CREATE RENTAL
============================================ */
router.post("/", async (req, res) => {
  try {
    const { equipment, farmer, startDate, endDate, transportResponsibility } = req.body;

    const equipmentData = await Equipment.findById(equipment);

    if (!equipmentData) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const rental = await Rental.create({
      equipment,
      farmer,
      owner: equipmentData.owner, // 🔥 MUST BE THIS
      startDate,
      endDate,
      transportResponsibility,
      status: "pending",
      transportStatus: "none",
      totalAmount: 400 // or calculate
    });

    console.log("✅ CREATED RENTAL:", rental);

    res.json(rental);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
/* ============================================
   OWNER RENTALS
============================================ */
router.get("/owner/:id", async (req, res) => {
  try {
    const rentals = await Rental.find({ owner: req.params.id })
      .populate("equipment")
      .populate("farmer", "name")
      .populate("transport", "name phone vehicleType");

    console.log("OWNER RENTALS:", rentals);

    res.json(rentals);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});



/* ============================================
   FARMER RENTALS
============================================ */
router.get("/renter/:farmerId", async (req, res) => {
  const rentals = await Rental.find({ farmer: req.params.farmerId })
    .populate("equipment")
    .populate("owner", "name")
    .populate("transport", "name phone vehicleType");

  res.json(rentals);
});



/* ============================================
   APPROVE RENTAL
============================================ */
router.put("/:id/approve", async (req, res) => {
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  res.json(rental);
});



/* ============================================
   REJECT RENTAL
============================================ */
router.put("/:id/reject", async (req, res) => {
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  res.json(rental);
});



/* ============================================
   ASSIGN TRANSPORT (OWNER FLOW)
============================================ */
router.put("/:id/assign-transport", async (req, res) => {
  try {
    const { transportId } = req.body;

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const equipment = await Equipment.findById(rental.equipment);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (!transportId) {
      return res.status(400).json({ message: "Transport ID missing" });
    }

    // ✅ update rental
    rental.transport = transportId;
    rental.transportStatus = "pending";
    await rental.save();

    // ✅ create transport request safely
    await TransportRequest.create({
      helper: transportId,
      farmer: rental.farmer,
      owner: rental.owner,
      equipment: rental.equipment,
      rental: rental._id,
      pickupLocation: equipment.location || "Not specified",
      deliveryLocation: "Contact farmer",
      transportDate: new Date(),
      status: "pending",
    });

    res.json({ message: "Transport assigned" });

  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
/* ============================================
   RESET TRANSPORT (AFTER REJECTION)
============================================ */
router.put("/:id/transport-reject", async (req, res) => {
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      transport: null,
      transportStatus: "rejected"
    },
    { new: true }
  );

  res.json(rental);
});

router.put("/:id/mark-paid", async (req, res) => {
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      paymentStatus: "paid",
      paymentId: req.body.paymentId
    },
    { new: true }
  );

  res.json(rental);
});
router.put("/:id/cod", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    rental.paymentMethod = "COD";   // ✅ THIS IS MISSING
    rental.paymentStatus = "pending";

    await rental.save();

    res.json({ message: "COD selected", rental });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.put("/:id/rate", async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating required" });
    }

    // ✅ 1. Find rental
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // ✅ 2. Save rating in rental
    rental.rating = rating;
    await rental.save();

    // 🔥 DEBUG
    console.log("Saved rating:", rating);
    console.log("Equipment ID:", rental.equipment);

    // ✅ 3. Get ALL ratings for this equipment
    const rentals = await Rental.find({
      equipment: rental.equipment,
      rating: { $ne: null }   // 🔥 IMPORTANT FIX
    });

    console.log("Ratings found:", rentals.map(r => r.rating));

    // ❌ If no ratings (should not happen)
    if (rentals.length === 0) {
      return res.json({ message: "No ratings found" });
    }
      // ✅ 4. Calculate average
    const total = rentals.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avg = total / rentals.length;

    console.log("Average:", avg);

    // ✅ 5. Update Equipment
    const updated = await Equipment.findByIdAndUpdate(
      rental.equipment,
      { rating: Number(avg.toFixed(1)) },
      { new: true }
    );

    console.log("Updated Equipment:", updated);

    res.json({ message: "Rating saved successfully", avg });

  } catch (err) {
    console.error("RATING ERROR:", err);
    res.status(500).json({ message: "Rating failed" });
  }
});
router.put("/:id/pay", async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "paid",
        paymentMethod: "ONLINE",
        paymentId: req.body.paymentId
      },
      { new: true }
    );

    res.json(rental);

  } catch (err) {
    console.error("PAY ERROR:", err);
    res.status(500).json({ message: "Payment update failed" });
  }
});
module.exports = router;