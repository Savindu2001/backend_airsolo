const { Hostel } = require('../models');

exports.createHostel = async (req, res) => {
    try {
        const { hotelier_id, name, description, address, city, country, contact_number, email, website, rating, main_image, gallery } = req.body;

        // Create the hostel
        const hostel = await Hostel.create({
            hotelier_id,
            name,
            description,
            address,
            city,
            country,
            contact_number,
            email,
            website,
            rating,
            main_image,
            gallery,
        });

        return res.status(201).json({ message: 'Hostel created successfully', hostel });
    } catch (error) {
        console.error('Error creating hostel:', error);
        return res.status(500).json({ message: 'An error occurred while creating the hostel', error: error.message });
    }
};

// Controller to get all hostels
exports.getAllHostels = async (req, res) => {
    try {
        const hostels = await Hostel.findAll();
        return res.status(200).json(hostels);
    } catch (error) {
        console.error('Error retrieving hostels:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving hostels', error: error.message });
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
