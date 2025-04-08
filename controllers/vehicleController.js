const { Vehicle } = require('../models');

// Controller to create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const { vehicle_number, driver_id, vehicleTypeId, number_of_seats } = req.body;

        // Validate required fields
        if (!vehicle_number || !vehicleTypeId || !number_of_seats || !driver_id) {
            return res.status(400).json({ message: 'Vehicle number, vehicle type ID, Driver Id and number of seats are required' });
        }

        // Create the vehicle
        const vehicle = await Vehicle.create({
            vehicle_number,
            driver_id,
            vehicleTypeId,
            number_of_seats,
        });

        return res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return res.status(500).json({ message: 'An error occurred while creating the vehicle', error: error.message });
    }
};

// Controller to get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        return res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error retrieving vehicles:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving vehicles', error: error.message });
    }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        return res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error retrieving vehicle:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving the vehicle', error: error.message });
    }
};

// Update a Vehicle by ID
exports.updateVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Validate fields before updating
        const { vehicle_number, driver_id, vehicleTypeId, number_of_seats } = req.body;
        if (!vehicle_number && !vehicleTypeId && !number_of_seats) {
            return res.status(400).json({ message: 'At least one field must be provided for update' });
        }

        await vehicle.update(req.body);
        return res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return res.status(500).json({ message: 'An error occurred while updating the vehicle', error: error.message });
    }
};

// Delete a vehicle by ID
exports.deleteVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        await vehicle.destroy(); // No need to pass req.body here
        return res.status(204).send(); // No content response for successful deletion
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the vehicle', error: error.message });
    }
};
