// clearBookings.js
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to DB');

    // Delete all documents in bookings collection
    const result = await mongoose.connection.db.collection('bookings').deleteMany({});
    console.log('Deleted documents:', result.deletedCount);

    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to DB:', err);
    process.exit(1);
  });
