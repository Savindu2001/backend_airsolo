const express = require('express');
const router = express.Router();
const taxiBookingController = require('../controllers/taxiBookingController');
const { authenticateJWT } = require('../middlewares/auth');

// Create new taxi booking
router.post('/create',authenticateJWT, taxiBookingController.createTaxiBooking);

// Update booking status
router.patch('/update-booking/:bookingId',authenticateJWT, taxiBookingController.updateTaxiBookingStatus);

// Get available shared bookings
router.get('/shared-available',authenticateJWT, taxiBookingController.getAvailableSharedBookings);

// Join a shared booking
router.post('/join/:bookingId',authenticateJWT, taxiBookingController.joinSharedBooking);

// Get available drivers
router.post('/available-drivers',authenticateJWT, taxiBookingController.getAvailableDrivers);

//Get Driver Bookings
router.get('/driver', authenticateJWT, taxiBookingController.getDriverBookings);

//Accept Booking by Driver
router.post('/driver-accept', authenticateJWT, taxiBookingController.acceptTaxiBooking);

module.exports = router;