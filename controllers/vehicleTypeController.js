const { VehicleType } = require('../models');

// Create Vehicle Type
const createVehicleType = async (req, res) => {
  const { type, pricePerKm } = req.body;

  try {
    const vehicleType = await VehicleType.create({ type, pricePerKm });
    return res.status(201).json(vehicleType);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create vehicle type', error: error.message });
  }
};

// Get all Vehicle Types
const getAllVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.findAll();
    return res.status(200).json(vehicleTypes);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve vehicle types', error: error.message });
  }
};

// Update Vehicle Type
const updateVehicleType = async (req, res) => {
  const { id } = req.params;
  const { pricePerKm } = req.body;

  try {
    const vehicleType = await VehicleType.findByPk(id);
    if (!vehicleType) {
      return res.status(404).json({ message: 'Vehicle type not found' });
    }

    vehicleType.pricePerKm = pricePerKm;
    await vehicleType.save();

    return res.status(200).json(vehicleType);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update vehicle type', error: error.message });
  }
};

// Delete Vehicle Type
const deleteVehicleType = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicleType = await VehicleType.findByPk(id);
    if (!vehicleType) {
      return res.status(404).json({ message: 'Vehicle type not found' });
    }

    await vehicleType.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete vehicle type', error: error.message });
  }
};

module.exports = { createVehicleType, getAllVehicleTypes, updateVehicleType, deleteVehicleType };
