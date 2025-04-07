const express = require('express');
const router = express.Router();
const hostelBookingController = require('../controllers/hostelBookingController');

// Create a booking
router.post('/book', hostelBookingController.createBooking);

// Get bookings for a specific user
router.get('/user/:userId', hostelBookingController.getUserBookings);

// Update booking status
router.put('/:bookingId/status', hostelBookingController.updateBookingStatus);

module.exports = router;
