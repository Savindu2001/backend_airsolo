const Hostel = require('../models/hostel');

// Create a new hostel
exports.createHostel = async (req, res) => {
    try {
        const hostel = await Hostel.create(req.body);
        res.status(201).json(hostel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all hostels
exports.getAllHostels = async (req, res) => {
    try {
        const hostels = await Hostel.findAll();
        res.status(200).json(hostels);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single hostel
exports.getHostelById = async (req, res) => {
    try {
        const hostel = await Hostel.findByPk(req.params.id);
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        res.status(200).json(hostel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a hostel
exports.updateHostel = async (req, res) => {
    try {
        const hostel = await Hostel.findByPk(req.params.id);
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        await hostel.update(req.body);
        res.status(200).json(hostel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a hostel
exports.deleteHostel = async (req, res) => {
    try {
        const hostel = await Hostel.findByPk(req.params.id);
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        await hostel.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
