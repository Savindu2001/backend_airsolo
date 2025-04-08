const express = require('express');
const router = express.Router();
const vehicleTypeController = require('../controllers/vehicleTypeController');

// Create Vehicle Type
router.post('/', vehicleTypeController.createVehicleType);

// Get All Vehicle Types
router.get('/', vehicleTypeController.getAllVehicleTypes);

// Update Vehicle Type
router.put('/:id', vehicleTypeController.updateVehicleType);

// Delete Vehicle Type
router.delete('/:id', vehicleTypeController.deleteVehicleType);

module.exports = router;
