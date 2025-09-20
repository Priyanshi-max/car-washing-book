const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(
  'mongodb+srv://@cluster0.iaey1ch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Booking schema
const bookingSchema = new mongoose.Schema({
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


// Make Booking model available in controllers
const Booking = mongoose.model('Booking', bookingSchema);
app.locals.Booking = Booking;

// Use routes
app.use('/api/bookings', bookingRoutes);

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
