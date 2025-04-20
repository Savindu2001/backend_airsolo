const { where } = require('sequelize');
const { HouseRule } = require('../models');


// Controller to create a new house rule
exports.createHouseRule = async (req, res) => {
    try {
        const { hostel_id, room_id, rule } = req.body;

        // Create the house rule
        const houseRule = await HouseRule.create({
            hostel_id,
            room_id,
            rule,
        });

        return res.status(201).json({ message: 'House rule created successfully', houseRule });
    } catch (error) {
        console.error('Error creating house rule:', error);
        return res.status(500).json({ message: 'An error occurred while creating the house rule', error: error.message });
    }
};

// Controller to get all house rules
exports.getAllHouseRules = async (req, res) => {
    try {
        const houseRules = await HouseRule.findAll();
        return res.status(200).json(houseRules);
    } catch (error) {
        console.error('Error retrieving house rules:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving house rules', error: error.message });
    }
};


// Get a single house rule by ID
exports.getHouseRuleById = async (req, res) => {
    try {
        const houseRule = await HouseRule.findByPk(req.params.id);
        if (!houseRule) {
            return res.status(404).json({ message: 'House rule not found' });
        }
        res.status(200).json(houseRule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Update a house rule by ID
exports.updateHouseRule = async (req, res) => {
    try {
        const houseRule = await HouseRule.findByPk(req.params.id);
        if (!houseRule) {
            return res.status(404).json({ message: 'House rule not found' });
        }
        await houseRule.update(req.body);
        res.status(200).json(houseRule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a house rule by ID
exports.deleteHouseRule = async (req, res) => {
    try {
        const houseRule = await HouseRule.findByPk(req.params.id);
        if (!houseRule) {
            return res.status(404).json({ message: 'House rule not found' });
        }
        await houseRule.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
