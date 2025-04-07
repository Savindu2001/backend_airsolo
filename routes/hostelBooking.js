const express = require('express');
const router = express.Router();
const hostelBookingController = require('../controllers/hostelBookingController');

router.post('/hostel-bookings',  hostelBookingController.createBooking);
router.patch('/hostel-bookings/:id/status', hostelBookingController.updateBookingStatus); 
  

module.exports = router;
