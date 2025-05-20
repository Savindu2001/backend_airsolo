const { VehicleType } = require('../models');

// Create Vehicle Type
const createVehicleType = async (req, res) => {
  const { type, priceFor5Km, additionalPricePerKm } = req.body;

  // Basic validation
  if (!type || priceFor5Km === undefined || additionalPricePerKm === undefined) {
    return res.status(400).json({ message: 'Type, price for 5 km, and additional price per km are required' });
  }

  try {
    const vehicleType = await VehicleType.create({ type, priceFor5Km, additionalPricePerKm });
    return res.status(201).json({message : 'Vehicle Type Created Successfully!', vehicleType});
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
  const { priceFor5Km, additionalPricePerKm } = req.body;

  // Basic validation
  if (priceFor5Km === undefined && additionalPricePerKm === undefined) {
    return res.status(400).json({ message: 'At least one of priceFor5Km or additionalPricePerKm must be provided' });
  }

  try {
    const vehicleType = await VehicleType.findByPk(id);
    if (!vehicleType) {
      return res.status(404).json({ message: 'Vehicle type not found' });
    }

    if (priceFor5Km !== undefined) {
      vehicleType.priceFor5Km = priceFor5Km;
    }
    if (additionalPricePerKm !== undefined) {
      vehicleType.additionalPricePerKm = additionalPricePerKm;
    }
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
    return res.status(204).send(); // No content response for deletion
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete vehicle type', error: error.message });
  }
};

module.exports = { createVehicleType, getAllVehicleTypes, updateVehicleType, deleteVehicleType };
