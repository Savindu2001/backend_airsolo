const express = require('express');
const router = express.Router();
const taxiPriceController = require('../controllers/taxiPriceController');

// Create a new taxi price
router.post('/', taxiPriceController.createTaxiPrice);

// Get all taxi prices
router.get('/', taxiPriceController.getAllTaxiPrices);

// Get a specific taxi price by ID
router.get('/:id', taxiPriceController.getTaxiPriceById);

// Update a taxi price
router.put('/:id', taxiPriceController.updateTaxiPrice);

// Delete a taxi price
router.delete('/:id', taxiPriceController.deleteTaxiPrice);

module.exports = router;
