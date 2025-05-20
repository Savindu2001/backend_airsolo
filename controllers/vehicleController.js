// controllers/vehicleController.js
const { Vehicle, VehicleType, User, HostVerification } = require('../models');
const { Op } = require('sequelize');

// Register a new vehicle
exports.registerVehicle = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    // Check if user is a driver
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can register vehicles' });
    }

    // Check if driver already has a vehicle
    const existingVehicle = await Vehicle.findOne({ where: { driver_id: req.user.uid } });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Driver already has a registered vehicle' });
    }

    const { 
      vehicle_number,
      model,
      year,
      color,
      numberOfSeats,
      vehicleTypeId
    } = req.body;

    // Create vehicle
    const vehicle = await Vehicle.create({
      driver_id: req.user.uid,
      vehicle_number,
      model,
      year,
      color,
      numberOfSeats,
      vehicleTypeId,
      isAvailable: false 
    });

    res.status(201).json({
      message: 'Vehicle registered successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register vehicle', error: error.message });
  }
};

// Update vehicle details
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [{ model: User, as: 'driver' }]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if user owns the vehicle
    if (vehicle.driverId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this vehicle' });
    }

    const { 
      make,
      model,
      year,
      color,
      numberOfSeats,
      vehicleTypeId
    } = req.body;

    // Update vehicle
    await vehicle.update({
      make,
      model,
      year,
      color,
      numberOfSeats,
      vehicleTypeId
    });

    res.status(200).json({
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
};

// Get vehicle details
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [
        { model: User, as: 'driver' },
        { model: VehicleType, as: 'vehicleType' }
      ]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get vehicle', error: error.message });
  }
};




// online & offline
exports.toggleAvailability = async (req, res) => {
  try {
    // Validate input
    if (typeof req.body.is_available !== 'boolean') {
      return res.status(400).json({ message: 'is_available must be a boolean' });
    }

    const vehicle = await Vehicle.findOne({ 
      where: { driver_id: req.user.uid },
      include: [{ model: HostVerification, as: 'status' }]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.update({ isAvailable: req.body.is_available });

    // Return the full updated vehicle object
    const updatedVehicle = await Vehicle.findOne({
      where: { driver_id: req.user.uid },
      include: [{ model: HostVerification, as: 'status' }]
    });

    res.status(200).json({
      message: `Vehicle is now ${vehicle.isAvailable ? 'online' : 'offline'}`,
      ...updatedVehicle.toJSON()
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ 
      message: 'Failed to toggle availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




// Update vehicle location
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const vehicle = await Vehicle.findOne({ where: { driver_id: req.user.uid } });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.update({
      currentLat: lat,
      currentLng: lng
    });

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
};

// Get available vehicles

exports.getAvailableVehicles = async (req, res) => {
  try {
    const { vehicleTypeId, lat, lng } = req.query;

    // Validate the presence of lat and lng
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Current location is required' });
    }

    // Fetch available vehicles within the 10km radius
    const vehicles = await Vehicle.findAll({
      where: {
        isAvailable: true,
        vehicleTypeId: vehicleTypeId || { [Op.ne]: null }, // Default to any vehicle type if not provided
        currentLat: { [Op.ne]: null }, // Ensure the vehicle has a location
        currentLng: { [Op.ne]: null }, // Ensure the vehicle has a location
      },
      include: [
        { model: User, as: 'driver' },
        { model: VehicleType, as: 'vehicleType' }
      ]
    });

    // Filter vehicles within the 10km radius
    const nearbyVehicles = vehicles.filter(vehicle => {
      const distance = calculateDistance(
        parseFloat(lat), parseFloat(lng),
        vehicle.currentLat, vehicle.currentLng
      );
      return distance <= 10; // 10km radius
    });

    // Return the filtered vehicles
    res.status(200).json(nearbyVehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get available vehicles', error: error.message });
  }
};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};
