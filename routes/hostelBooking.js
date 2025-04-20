const express = require('express');
const router = express.Router();
const hostelBookingController = require('../controllers/hostelBookingController');

router.post('/',  hostelBookingController.createBooking);
router.get('/', hostelBookingController.getAllBookings);
router.get('/userBookings/:id', hostelBookingController.getAllBookingsByUserId);
router.patch('/:id/status', hostelBookingController.updateBookingStatus);
router.patch('/confirm/:id', hostelBookingController.confirmBooking);
router.patch('/payment/:id', hostelBookingController.handlePaymentWebhook);
  

module.exports = router;
