const { TaxiPrice } = require('../models');

exports.createTaxiPrice = async (req, res) => {
    try {
        const { fromCityId, toCityId, vehicleTypeId, price } = req.body;

        // Validate required fields
        if (!fromCityId || !toCityId || !vehicleTypeId || !price) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create the taxi price
        const taxiPrice = await TaxiPrice.create({
            fromCityId,
            toCityId,
            vehicleTypeId,
            price,
        });

        return res.status(201).json({ message: 'Taxi price created successfully', taxiPrice });
    } catch (error) {
        console.error('Error creating taxi price:', error);
        return res.status(500).json({ message: 'An error occurred while creating the taxi price', error: error.message });
    }
};

// Get all taxi prices
exports.getAllTaxiPrices = async (req, res) => {
    try {
        const taxiPrices = await TaxiPrice.findAll();
        return res.status(200).json(taxiPrices);
    } catch (error) {
        console.error('Error retrieving taxi prices:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving taxi prices', error: error.message });
    }
};

// Get a specific taxi price by ID
exports.getTaxiPriceById = async (req, res) => {
    try {
        const taxiPrice = await TaxiPrice.findByPk(req.params.id);
        if (!taxiPrice) {
            return res.status(404).json({ message: 'Taxi price not found' });
        }
        res.status(200).json(taxiPrice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a taxi price
exports.updateTaxiPrice = async (req, res) => {
    try {
        const taxiPrice = await TaxiPrice.findByPk(req.params.id);
        if (!taxiPrice) {
            return res.status(404).json({ message: 'Taxi price not found' });
        }
        await taxiPrice.update(req.body);
        res.status(200).json(taxiPrice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a taxi price
exports.deleteTaxiPrice = async (req, res) => {
    try {
        const taxiPrice = await TaxiPrice.findByPk(req.params.id);
        if (!taxiPrice) {
            return res.status(404).json({ message: 'Taxi price not found' });
        }
        await taxiPrice.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
