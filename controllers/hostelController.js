const { Hostel,City } = require('../models');

exports.createHostel = async (req, res) => {
    try {
        const { hotelier_id, name, description, address, cityId,latitude,longitude, country, contact_number, email, website, rating } = req.body;

        // Check if main_image and gallery are set correctly
        const galleryImages = req.body.gallery || []; // Ensure it's an array

        // console.log("Main Image URL: ", mainImage); // Debugging log
        // console.log("Gallery URLs: ", galleryImages); // Debugging log

        // Validate required fields
        if (!name || !cityId) {
            return res.status(400).json({ message: 'Hostel name and city are required.' });
        }


        // Create the hostel
        const hostel = await Hostel.create({
            hotelier_id,
            name,
            description,
            address,
            cityId,
            latitude,
            longitude,
            country,
            contact_number,
            email,
            website,
            rating,
            gallery: galleryImages, // Ensure this is assigned correctly
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
