const express = require('express');
const router = express.Router();
const hostelBookingController = require('../controllers/hostelBookingController');

router.post('/',  hostelBookingController.createBooking);
router.get('/', hostelBookingController.getAllBookings);
router.patch('/:id/status', hostelBookingController.updateBookingStatus); 
  

module.exports = router;
