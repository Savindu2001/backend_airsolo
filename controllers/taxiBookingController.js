const { TaxiBooking, Vehicle, VehicleType, User } = require('../models');
const { calculateDistance } = require('../services/geoUtils');
const { notifyDriver, notifyUser } = require('../services/notificationService');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Calculate fare based on vehicle type and distance
const calculateFare = (vehicleType, distance) => {
  if (distance <= 5) return parseFloat(vehicleType.priceFor5Km);
  return parseFloat(vehicleType.priceFor5Km) + ((distance - 5) * parseFloat(vehicleType.additionalPricePerKm));
};

// Create a new taxi booking (private or shared)
exports.createTaxiBooking = async (req, res) => {
  try {
    const {
      pickupLocation, dropLocation,
      pickupLat, pickupLng, dropLat, dropLng,
      vehicleTypeId, isShared = false,
      scheduledAt, seatsToBook = 1
    } = req.body;

    // Validate input
    if (!pickupLocation || !dropLocation || !pickupLat || !pickupLng || !dropLat || !dropLng || !vehicleTypeId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const vehicleType = await VehicleType.findByPk(vehicleTypeId);
    if (!vehicleType) return res.status(404).json({ message: 'Vehicle type not found' });

    const distance = calculateDistance(pickupLat, pickupLng, dropLat, dropLng);
    const totalFare = isShared ? (calculateFare(vehicleType, distance) / seatsToBook) : calculateFare(vehicleType, distance);

    const booking = await TaxiBooking.create({
      travelerId: req.user.uid,
      pickupLocation, dropLocation,
      pickupLat, pickupLng, dropLat, dropLng,
      vehicleTypeId,
      distance,
      totalPrice: totalFare,
      isShared,
      seatsToShare: isShared ? seatsToBook : null,
      travelerIds: [req.user.uid],
      bookedSeats: isShared ? seatsToBook : 1,
      scheduledAt: scheduledAt || null,
      status: 'pending',
    });

    // Find available drivers within 10km
    const availableVehicles = await Vehicle.findAll({
      where: {
        vehicleTypeId,
        isAvailable: true,
        [Op.and]: [
          sequelize.literal(`ST_Distance_Sphere(
            POINT(${pickupLng}, ${pickupLat}),
            POINT(current_lng, current_lat)
          ) <= 10000`)
        ]
      },
      include: [
        { model: User, as: 'driver' },
        { model: VehicleType, as: 'vehicleType' }
      ]
    });
    console.log("Available Vehicles:", availableVehicles);


    // Notify available drivers
    for (const vehicle of availableVehicles) {
      await notifyDriver(vehicle.driverId, {
        bookingId: booking.id,
        pickupLocation,
        dropLocation,
        distance,
        fare: totalFare,
        vehicleType: vehicleType.type
      });
    }

    res.status(201).json({ message: 'Taxi booked successfully. Searching for drivers...', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};













// Get booking details
exports.getTaxiBooking = async (req, res) => {
  try {
    const booking = await TaxiBooking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'traveler' },
        { model: Vehicle, as: 'vehicle', include: [{ model: User, as: 'driver' }] },
        { model: VehicleType, as: 'vehicleType' }
      ]
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only traveler or driver can view booking
    if (booking.travelerId !== req.user.id && 
        (!booking.vehicle || booking.vehicle.driverId !== req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to view this booking' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get booking', error: error.message });
  }
};





// Driver accepts booking
exports.acceptTaxiBooking = async (req, res) => {
  try {
    const booking = await TaxiBooking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if booking is already assigned
    if (booking.vehicleId) {
      return res.status(400).json({ message: 'Booking already assigned to another driver' });
    }

    const vehicle = await Vehicle.findOne({ 
      where: { driverId: req.user.uid },
      include: [{ model: VehicleType }]
    });
    if (!vehicle) return res.status(404).json({ message: 'Driver vehicle not found' });

    if (vehicle.vehicleTypeId !== booking.vehicleTypeId)
      return res.status(400).json({ message: 'Vehicle type mismatch' });

    // For shared rides, check available seats
    if (booking.isShared && vehicle.number_of_seats < booking.bookedSeats) {
      return res.status(400).json({ 
        message: `Vehicle only has ${vehicle.number_of_seats} seats available` 
      });
    }

    booking.vehicleId = vehicle.id;
    booking.status = 'driver_accepted';
    await booking.save();

    await notifyUser(booking.travelerId, { 
      title: 'Driver Accepted', 
      body: 'Your driver is coming!', 
      data: { bookingId: booking.id } 
    });

    res.status(200).json({ message: 'Booking accepted', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept booking', error: error.message });
  }
};

// Update booking status (driver)
exports.updateTaxiBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await TaxiBooking.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: 'vehicle' }]
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if driver owns the vehicle in booking
    if (!booking.vehicle || booking.vehicle.driverId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this booking' });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['driver_accepted', 'cancelled'],
      'driver_accepted': ['driver_arrived', 'cancelled'],
      'driver_arrived': ['ride_started', 'cancelled'],
      'ride_started': ['ride_completed']
    };

    if (!validTransitions[booking.status] || 
        !validTransitions[booking.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    booking.status = status;
    
    // Set timestamps
    if (status === 'ride_started') booking.startedAt = new Date();
    if (status === 'ride_completed') booking.completedAt = new Date();

    await booking.save();

    // Notify traveler
    const notifications = {
      'driver_accepted': { title: 'Driver Accepted', body: 'Your driver is coming!' },
      'driver_arrived': { title: 'Driver Arrived', body: 'Your driver has arrived!' },
      'ride_started': { title: 'Ride Started', body: 'Your ride has started!' },
      'ride_completed': { title: 'Ride Completed', body: 'Your ride has completed!' },
      'cancelled': { title: 'Ride Cancelled', body: 'Your ride was cancelled' }
    };

    if (notifications[status]) {
      await notifyUser(booking.travelerId, {
        ...notifications[status],
        data: { bookingId: booking.id }
      });
    }

    res.status(200).json({ message: 'Status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// Get available shared bookings
exports.getAvailableSharedBookings = async (req, res) => {
  try {
    const bookings = await TaxiBooking.findAll({
      where: { 
        isShared: true, 
        status: 'pending',
        scheduledAt: { [Op.gte]: new Date() } // Only future bookings
      },
      include: [{ model: Vehicle, include: [{ model: VehicleType }] }]
    });

    const available = bookings.filter(b => {
      const availableSeats = b.Vehicle.number_of_seats - b.bookedSeats;
      return availableSeats > 0;
    });

    res.status(200).json({ sharedBookings: available });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get shared bookings', error: error.message });
  }
};

// Join existing shared booking
exports.joinSharedBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { seatsToBook } = req.body;

    if (!seatsToBook || seatsToBook < 1) {
      return res.status(400).json({ message: 'Invalid number of seats' });
    }

    const booking = await TaxiBooking.findByPk(bookingId, {
      include: [{ model: Vehicle }]
    });

    if (!booking || !booking.isShared || booking.status !== 'pending')
      return res.status(404).json({ message: 'Booking unavailable' });

    if (!booking.Vehicle)
      return res.status(404).json({ message: 'Vehicle not found' });

    const availableSeats = booking.Vehicle.number_of_seats - booking.bookedSeats;
    if (seatsToBook > availableSeats)
      return res.status(400).json({ message: `Only ${availableSeats} seats available` });

    // Update booking
    booking.bookedSeats += seatsToBook;
    booking.travelerIds = [...booking.travelerIds, req.user.id];
    await booking.save();

    res.status(200).json({ message: 'Joined shared booking', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join booking', error: error.message });
  }
};

// Search available drivers near pickup location
exports.getAvailableDrivers = async (req, res) => {
  try {
    const { vehicleTypeId, pickupLat, pickupLng } = req.body;

    if (!vehicleTypeId || !pickupLat || !pickupLng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const vehicles = await Vehicle.findAll({
      where: { 
        vehicleTypeId, 
        isAvailable: true 
      },
      include: [
        { model: User, as: 'driver' }, 
        { model: VehicleType }
      ]
    });

    const nearbyVehicles = vehicles.filter(vehicle => {
      const distance = calculateDistance(pickupLat, pickupLng, vehicle.currentLat, vehicle.currentLng);
      return distance <= 10; // Within 10km
    });

    const drivers = nearbyVehicles.map(vehicle => ({
      vehicleId: vehicle.id,
      driverName: vehicle.driver?.name || 'Unknown',
      driverPhone: vehicle.driver?.phone || '',
      vehicleType: vehicle.VehicleType?.type || 'Unknown',
      seats: vehicle.number_of_seats,
      currentLocation: { lat: vehicle.currentLat, lng: vehicle.currentLng },
      distance: calculateDistance(pickupLat, pickupLng, vehicle.currentLat, vehicle.currentLng)
    }));

    // Sort by distance
    drivers.sort((a, b) => a.distance - b.distance);

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers', error: error.message });
  }
};

// Get user's booking history
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await TaxiBooking.findAll({
      where: { travelerId: req.user.id },
      include: [
        { model: Vehicle, as: 'vehicle', include: [{ model: User, as: 'driver' }] },
        { model: VehicleType, as: 'vehicleType' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get bookings', error: error.message });
  }
};

// Get driver's bookings
exports.getDriverBookings = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { driverId: req.user.id } });
    if (!vehicle) {
      return res.status(404).json({ message: 'Driver vehicle not found' });
    }

    const bookings = await TaxiBooking.findAll({
      where: { vehicleId: vehicle.id },
      include: [
        { model: User, as: 'traveler' },
        { model: VehicleType, as: 'vehicleType' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get bookings', error: error.message });
  }
};