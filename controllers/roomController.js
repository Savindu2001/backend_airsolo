const { Room } = require('../models');

exports.createRoom = async (req, res) => {
    try {
        const { hostel_id, name, type, bed_type, bed_qty, max_occupancy, price_per_person, images, facility_ids } = req.body;

        // Create the room
        const room = await Room.create({
            hostel_id,
            name,
            type,
            bed_type,
            bed_qty,
            max_occupancy,
            price_per_person,
            images,
            facility_ids,
        });

        return res.status(201).json({ message: 'Room created successfully', room });
    } catch (error) {
        console.error('Error creating room:', error);
        return res.status(500).json({ message: 'An error occurred while creating the room', error: error.message });
    }
};

// Controller to get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        return res.status(200).json(rooms);
    } catch (error) {
        console.error('Error retrieving rooms:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving rooms', error: error.message });
    }
};

// Get a single room
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a room
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        await room.update(req.body);
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        await room.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
