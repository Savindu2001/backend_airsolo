const express = require('express');
const router = express.Router();
const taxiBookingController = require('../controllers/taxiBookingController');

// Route to create a taxi booking
router.post('/', taxiBookingController.createTaxiBooking);

// Route to get available vehicles
router.get('/available', taxiBookingController.getAvailableVehicles);

module.exports = router;
