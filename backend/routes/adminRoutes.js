const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");
const Rental = require("../models/Rental");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../models/User");

// =====================
// 📊 ANALYTICS ROUTE
// =====================
router.get("/analytics", auth, admin, async (req, res) => {
  try {
    const rentals = await Rental.find().populate("equipment");

    let revenue = 0;
    const map = {};

    rentals.forEach((r) => {
      revenue += r.totalAmount || 0;

      const name = r.equipment?.name || "Unknown";

      map[name] = (map[name] || 0) + 1;
    });

    const topEquipment = Object.keys(map).map((key) => ({
      name: key,
      totalRented: map[key],
    }));

    res.json({ success: true, revenue, topEquipment });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Analytics error" });
  }
});


// =====================
// 📦 GET ALL EQUIPMENT
// =====================
router.get("/equipment", auth, admin, async (req, res) => {
  try {
    const items = await Equipment.find();
    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching equipment" });
  }
});


// =====================
// 🗑 DELETE EQUIPMENT
// =====================
router.delete("/equipment/:id", auth, admin, async (req, res) => {
  await Equipment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});


// =====================
// ✏️ UPDATE EQUIPMENT
// =====================
router.put("/equipment/:id", auth, admin, async (req, res) => {
  const updated = await Equipment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// =====================
// 👥 GET ALL USERS
// =====================
router.get("/users", auth, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// =====================
// 🗑 DELETE USER
// =====================
router.delete("/users/:id", auth, admin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

router.get("/monthly-analytics", auth, admin, async (req, res) => {
  const Rental = require("../models/Rental");

  const data = await Rental.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // ✅ initialize all months with 0
  const result = months.map((month, index) => {
    const found = data.find((d) => d._id === index + 1);

    return {
      month,
      revenue: found ? found.revenue : 0,
    };
  });

  res.json(result);
});


module.exports = router;