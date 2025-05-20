// routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateJWT } = require('../middlewares/auth');

// Register a new vehicle
router.post('/', authenticateJWT , vehicleController.registerVehicle);

// Update vehicle details
router.put('/:id', authenticateJWT , vehicleController.updateVehicle);

// Get vehicle details
router.get('/:id', authenticateJWT , vehicleController.getVehicle);

// Toggle vehicle availability
router.put('/v2/availability', authenticateJWT , vehicleController.toggleAvailability);

// Update vehicle location
router.put('/:id/location', authenticateJWT , vehicleController.updateLocation);

// Get available vehicles
router.get('/available', authenticateJWT , vehicleController.getAvailableVehicles);




module.exports = router;