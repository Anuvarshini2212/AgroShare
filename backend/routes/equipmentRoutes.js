const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");
const upload = require("../middleware/upload");
const crypto = require("crypto");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, pricePerDay, location, ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID required" });
    }

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid Owner ID" });
    }

    console.log("Creating equipment for owner:", ownerId);
    console.log("Uploaded file:", req.file);

    const equipment = await Equipment.create({
      name,
      category,
      pricePerDay,
      location,

      // Save uploaded image path
      image: req.file ? `/uploads/${req.file.filename}` : "",

      owner: ownerId
    });

    res.status(201).json(equipment);

  } catch (err) {
    console.error("Create Equipment Error:", err);
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Equipment.find().populate("owner", "name email");

    res.json(list);

  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Equipment ID" });
    }

    const equipment = await Equipment.findById(id).populate("owner", "name email");

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json(equipment);

  } catch (err) {
    console.error("GET EQUIPMENT ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Equipment ID" });
    }

    const updated = await Equipment.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Equipment ID"
      });
    }

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    // Check whether the logged-in user owns this equipment
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this equipment"
      });
    }

    await Equipment.findByIdAndDelete(id);

    res.json({
      message: "Equipment deleted successfully"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      message: "Delete failed"
    });
  }
});

router.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;