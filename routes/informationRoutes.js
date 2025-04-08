const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');

// Define routes for information
router.post('/', informationController.createInformation); // Create new information
router.get('/', informationController.getAllInformation); // Get all information
router.get('/:id', informationController.getInformationById); // Get information by ID
router.put('/:id', informationController.updateInformation); // Update information
router.delete('/:id', informationController.deleteInformation); // Delete information

module.exports = router;
