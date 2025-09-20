const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Booking schema
const bookingSchema = new mongoose.Schema({
  bookingId: { type: Number, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  carDetails: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    type: { type: String },
    color: { type: String },
    licensePlate: { type: String }
  },
  serviceType: { type: String, required: true },
  addOns: [String],
  date: { type: String, required: true },
  timeSlot: { type: String },
  duration: { type: Number },
  price: { type: Number },
  status: { type: String },
  rating: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  location: { type: String }
});


// Register model globally so controllers can use it
const Booking = mongoose.model("Booking", bookingSchema);
app.locals.Booking = Booking;

// Routes
app.use("/api/bookings", bookingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
