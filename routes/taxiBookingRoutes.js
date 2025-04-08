const express = require('express');
const router = express.Router();
const { bookingTaxi, updateBookingStatus ,getAvailableSharedBookings ,joinSharedBooking} = require('../controllers/taxiBookingController');

// Route to book a taxi
router.post('/', bookingTaxi);

// Route to update booking status
router.patch('/update-booking/:bookingId', updateBookingStatus);

// Get Shared Booking
router.get('/shared-available', getAvailableSharedBookings);

// Join to Shared Booking
router.post('/join/:Id', joinSharedBooking);

// Update Booking Status
router.put('/:bookingId/status',updateBookingStatus);

module.exports = router;
