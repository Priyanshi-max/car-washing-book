// Helper to get Booking model
const getBookingModel = (req) => req.app.locals.Booking;

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const Booking = getBookingModel(req);
    const bookings = await Booking.find().sort({ bookingId: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get booking by bookingId
exports.getBookingById = async (req, res) => {
  try {
    const Booking = getBookingModel(req);
    const booking = await Booking.findOne({ bookingId: Number(req.params.id) }); // use bookingId
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const Booking = getBookingModel(req);

    // Get the last bookingId from DB
    const lastBooking = await Booking.findOne().sort({ bookingId: -1 });

    // Increment or start from 1
    const newBookingId = lastBooking ? lastBooking.bookingId + 1 : 1;

    const newBooking = new Booking({
      ...req.body,
      bookingId: newBookingId, // Add bookingId here
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update booking by bookingId
exports.updateBooking = async (req, res) => {
  try {
    const Booking = getBookingModel(req);
    const { bookingId, ...updateData } = req.body; // prevent overwriting bookingId

    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId: Number(req.params.id) }, // query by bookingId
      updateData,
      { new: true }
    );

    if (!updatedBooking) 
      return res.status(404).json({ message: 'Booking not found' });

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete booking by bookingId
exports.deleteBooking = async (req, res) => {
  try {
    const Booking = getBookingModel(req);
    const deletedBooking = await Booking.findOneAndDelete({ bookingId: Number(req.params.id) });
    if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};