
const { Facility } = require('../models');
// Create a new facility
exports.createFacility = async (req, res) => {
    try {
        const { icon, name } = req.body;

        // Create the facility
        const facility = await Facility.create({
            icon,
            name,
        });

        return res.status(201).json({ message: 'Facility created successfully', facility });
    } catch (error) {
        console.error('Error creating facility:', error);
        return res.status(500).json({ message: 'An error occurred while creating the facility', error });
    }
};

// Get all facilities
exports.getAllFacilities = async (req, res) => {
    try {
        const facilities = await Facility.findAll();
        res.status(200).json(facilities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single facility by ID
exports.getFacilityById = async (req, res) => {
    try {
        const facility = await Facility.findByPk(req.params.id);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found' });
        }
        res.status(200).json(facility);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Update a facility by ID
exports.updateFacility = async (req, res) => {
    try {
        const facility = await Facility.findByPk(req.params.id);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found' });
        }
        await facility.update(req.body);
        res.status(200).json(facility);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a facility by ID
exports.deleteFacility = async (req, res) => {
    try {
        const facility = await Facility.findByPk(req.params.id);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found' });
        }
        await facility.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
