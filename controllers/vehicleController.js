const { Vehicle} = require('../models');

// Controller to create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const { vehicle_number, type, number_of_seats } = req.body;

        // Create the vehicle
        const vehicle = await Vehicle.create({
            vehicle_number,
            type,
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

//Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
    try{
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json(vehicle);

    } catch (error){
        res.status(400).json({ error: error.message });
    }
};

// Update a Vehicle by ID
exports.updateVehicleById = async (req, res) => {
    try{
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        await vehicle.update(req.body);
        res.status(200).json(vehicle);
        
    }catch (error){
        res.status(400).json({ error: error.message });
    }
};

// Delete a vehicle by ID
exports.deleteVehicleById = async (req, res) => {
    try{
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        await vehicle.destroy(req.body);
        res.status(204).send();
    }catch (error){
        res.status(400).json({ error: error.message });
    }
};