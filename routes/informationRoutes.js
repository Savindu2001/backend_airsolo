const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');
const { authenticateJWT } = require('../middlewares/auth');

// Define routes for information
router.post('/',authenticateJWT,  informationController.createInformation); // Create new information
router.get('/',authenticateJWT,  informationController.getAllInformation); // Get all information
router.get('/:id',authenticateJWT,  informationController.getInformationById); // Get information by ID
router.put('/:id',authenticateJWT,  informationController.updateInformation); // Update information
router.delete('/:id',authenticateJWT,  informationController.deleteInformation); // Delete information

module.exports = router;
