const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');

// Facility routes
router.post('/', facilityController.createFacility);
router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacilityById);
router.put('/:id', facilityController.updateFacility);
router.delete('/:id', facilityController.deleteFacility);

module.exports = router;
