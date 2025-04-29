const express = require('express');
const router = express.Router();
const taxiBookingController = require('../controllers/taxiBookingController');
const { authenticateJWT } = require('../middlewares/auth');




// Customer
router.post('/create', authenticateJWT, taxiBookingController.createTaxiBooking);
router.post('/join/:bookingId', authenticateJWT, taxiBookingController.joinSharedBooking);
router.post('/available-drivers', authenticateJWT, taxiBookingController.getAvailableDrivers);
router.put('/update-booking/:bookingId', authenticateJWT, taxiBookingController.updateTaxiBookingStatus);
router.put('/booking-payment/:bookingId', authenticateJWT, taxiBookingController.updatePaymentStatus);
router.get('/all', authenticateJWT, taxiBookingController.getAllTaxiBookings);

// Driver
router.get('/driver-nearby', authenticateJWT, taxiBookingController.getNearbyBookings);
router.get('/driver-accept/:bookingId', authenticateJWT, taxiBookingController.getAcceptedBooking);



module.exports = router;