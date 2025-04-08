const express = require('express');
const router = express.Router();
const { bookingTaxi, updateBookingStatus } = require('../controllers/taxiBookingController');

// Route to book a taxi
router.post('/', bookingTaxi);

// Route to update booking status
router.patch('/update-booking/:bookingId', updateBookingStatus);

module.exports = router;
