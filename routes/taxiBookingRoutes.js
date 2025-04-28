const express = require('express');
const router = express.Router();
const taxiBookingController = require('../controllers/taxiBookingController');

// Create new taxi booking
router.post('/create', taxiBookingController.createTaxiBooking);

// Update booking status
router.patch('/update-booking/:bookingId', taxiBookingController.updateTaxiBookingStatus);

// Get available shared bookings
router.get('/shared-available', taxiBookingController.getAvailableSharedBookings);

// Join a shared booking
router.post('/join/:bookingId', taxiBookingController.joinSharedBooking);

// Get available drivers
router.post('/available-drivers', taxiBookingController.getAvailableDrivers);



module.exports = router;