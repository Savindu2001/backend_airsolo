const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Vehicle routes
router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', vehicleController.updateVehicleById);
router.delete('/:id', vehicleController.deleteVehicleById);

module.exports = router;
