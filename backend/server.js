const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const transportRoutes = require("./routes/transportRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");  
const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",  // local frontend
    "https://frontend-jet-seven-94.vercel.app" // deployed frontend
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.error(err));
