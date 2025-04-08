const { TaxiBooking, Vehicle, City } = require('../models');

// Create a taxi booking
exports.createTaxiBooking = async (req, res) => {
  const { userId, fromCityId, toCityId, vehicleId, price, isShared, sharedWith } = req.body;

  try {
    // Create a new taxi booking
    const booking = await TaxiBooking.create({
      userId,
      fromCityId,
      toCityId,
      vehicleId,
      price,
      isShared,
      sharedWith,
    });

    return res.status(201).json({ message: 'Taxi booking created successfully', booking });
  } catch (error) {
    console.error('Error creating taxi booking:', error);
    return res.status(500).json({ message: 'Failed to create taxi booking', error: error.message });
  }
};

// Get available vehicles for booking
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: {
        // Add filtering criteria if needed
      },
    });

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    return res.status(500).json({ message: 'Failed to fetch available vehicles', error: error.message });
  }
};
