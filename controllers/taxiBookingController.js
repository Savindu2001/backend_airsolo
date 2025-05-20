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



// Get all taxi bookings (admin view)
exports.getAllTaxiBookings = async (req, res) => {
  try {
    const { status, isShared } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (isShared) whereClause.isShared = isShared === 'true';
    
    const bookings = await TaxiBooking.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'traveler' },
        { model: Vehicle, as: 'assignedVehicle', include: [{ model: User, as: 'driver' }] },
        
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get bookings', error: error.message });
  }
};



// Join to Exciting Shared Bookings
exports.joinSharedBooking = async (req, res) => {
  // const transaction = await sequelize.transaction(); // Temporarily removed transaction
  try {
    const { bookingId } = req.params;
    const { seatsToBook, pickupLat, pickupLng } = req.body;

    if (!seatsToBook || seatsToBook < 1) {
      // await transaction.rollback();
      return res.status(400).json({ message: 'Invalid number of seats' });
    }

    const booking = await TaxiBooking.findByPk(bookingId, {
      include: [
        { model: Vehicle, as: 'assignedVehicle'},
      ],
      // transaction
    });

    if (!booking || !booking.isShared || booking.status !== 'pending') {
      // await transaction.rollback();
      return res.status(404).json({ message: 'Booking unavailable' });
    }

    // Check if booking is in the future
    if (booking.scheduledAt && new Date(booking.scheduledAt) < new Date()) {
      // await transaction.rollback();
      return res.status(400).json({ message: 'This booking has already passed' });
    }

    // Check pickup location within 1km (shared ride rule)
    if (pickupLat && pickupLng) {
      const distance = calculateDistance(
        parseFloat(pickupLat),
        parseFloat(pickupLng),
        booking.pickupLat,
        booking.pickupLng
      );
      // if (distance > 1) {
      //   // await transaction.rollback();
      //   return res.status(400).json({
      //     message: 'Pickup location must be within 1km of the original booking',
      //   });
      // }
    }

    const availableSeats = booking.bookedSeats - booking.seatsToBook;
    
    
    if (seatsToBook > availableSeats) {
      // await transaction.rollback();
      return res.status(400).json({ message: `Only ${availableSeats} seats available` });
    }

    // Update booking with new traveler
    booking.bookedSeats += seatsToBook;
    let travelerIds = booking.travelerIds;

    // Fix if it's a string instead of an array
    if (typeof travelerIds === 'string') {
      try {
        travelerIds = JSON.parse(travelerIds);
      } catch (e) {
        travelerIds = [];
      }
    }

    // Ensure it's an array
    if (!Array.isArray(travelerIds)) {
      travelerIds = [];
    }

    // Add new traveler if not already in list
    if (!travelerIds.includes(req.user.uid)) {
      travelerIds.push(req.user.uid);
    }

    booking.travelerIds = travelerIds;
    await booking.save();

    // await booking.save({ transaction });

    // COMMENTED: Fare split logic (not needed until payment system is active)
    /*
    const totalTravelers = booking.travelerIds.length;
    const newTotalPrice = calculateFare(booking.VehicleType, booking.distance) / totalTravelers;
    booking.totalPrice = newTotalPrice;
    await booking.save({ transaction });
    */

    // await transaction.commit();
    return res.status(200).json({ message: 'Joined shared booking', booking });

  } catch (error) {
    // await transaction.rollback();
    return res.status(500).json({ message: 'Failed to join booking', error: error.message });
  }
};




// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { bookingId } = req.params;
    const { paymentStatus } = req.body;

    const booking = await TaxiBooking.findByPk(bookingId, { transaction });
    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate payment status transition
    const validTransitions = {
      'pending': ['paid', 'failed'],
      'paid': ['refunded'],
      'failed': ['pending'],
      'refunded': [] // No transitions after refunded
    };

    if (!validTransitions[booking.paymentStatus] || 
        !validTransitions[booking.paymentStatus].includes(paymentStatus)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid payment status transition' });
    }

    // Update payment status
    booking.paymentStatus = paymentStatus;
    await booking.save({ transaction });

    // If payment is successful, update booking status
    if (paymentStatus === 'paid' && booking.status === 'driver_accepted') {
      booking.status = 'driver_arrived';
      await booking.save({ transaction });
      
      // Notify driver
      await notifyUser(booking.assignedVehicle.driverId, {
        title: 'Payment Received',
        body: 'Payment received for booking #' + booking.id,
        data: { bookingId: booking.id }
      });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Payment status updated', booking });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
};


// Get All Available Drivers
exports.getAvailableDrivers = async (req, res) => {
  try {
    const { vehicleTypeId, pickupLat, pickupLng, maxDistance = 10 } = req.body;

    if (!vehicleTypeId || !pickupLat || !pickupLng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const vehicles = await Vehicle.findAll({
      where: { 
        vehicleTypeId, 
        isAvailable: true,
        currentLat: { [Op.ne]: null },
        currentLng: { [Op.ne]: null }
      },
      include: [
        { model: User, as: 'driver' }, 
        { model: VehicleType, as: 'vehicleType' }
      ]
    });

    const nearbyVehicles = vehicles.map(vehicle => {
      const distance = calculateDistance(
        parseFloat(pickupLat), parseFloat(pickupLng),
        vehicle.currentLat, vehicle.currentLng
      );
      return { ...vehicle.toJSON(), distance };
    }).filter(vehicle => vehicle.distance <= maxDistance);

    // Sort by distance and availability
    nearbyVehicles.sort((a, b) => a.distance - b.distance);

    // Format response
    const drivers = nearbyVehicles.map(vehicle => ({
      driverId: vehicle.driver.id,
      driverName: vehicle.driver.name,
      vehicleId: vehicle.id,
      vehicleNumber: vehicle.vehicle_number,
      vehicleType: vehicle.vehicleType.type,
      seats: vehicle.number_of_seats,
      distance: vehicle.distance,
      currentLocation: { lat: vehicle.currentLat, lng: vehicle.currentLng },
      fcmToken: vehicle.fcmToken
    }));

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers', error: error.message });
  }
};

exports.getNearbyBookings = async (req, res) => {
  try {
    const driverId = req.user.uid;
    
    // Get driver's vehicle and current location
    const vehicle = await Vehicle.findOne({ 
      where: { driver_id: driverId },
      include: [
        { model: VehicleType, as: 'vehicleType' }
      ]
    });

    if (!vehicle || !vehicle.currentLat || !vehicle.currentLng) {
      return res.status(400).json({ message: 'Driver location not available' });
    }

    // Find bookings within 10km of driver's location
    const bookings = await TaxiBooking.findAll({
      where: { 
        status: 'pending',
        [Op.or]: [
          { vehicleId: null }, // Unassigned bookings
          { vehicleId: vehicle.id } // Or assigned to this driver
        ]
      },
      include: [
        { model: User, as: 'traveler' },
        {
          model: Vehicle, 
          as: 'assignedVehicle',
          include: [
            { model: VehicleType, as: 'vehicleType' }
          ]
        }
      ]
    });

    // Filter bookings within 10km radius
    const nearbyBookings = bookings.filter(booking => {
      const distance = calculateDistance(
        vehicle.currentLat, vehicle.currentLng,
        booking.pickupLat, booking.pickupLng
      );

      // Return true if:
      // 1. Distance is within 10km AND
      // 2. Either:
      //    a. Booking has no vehicle assigned OR
      //    b. Booking's vehicle type matches driver's vehicle type
      return (
        distance <= 10 && 
        (
          !booking.assignedVehicle || 
          booking.assignedVehicle.vehicleTypeId === vehicle.vehicleTypeId
        )
      );
    }).map(booking => {
      const distance = calculateDistance(
        vehicle.currentLat, vehicle.currentLng,
        booking.pickupLat, booking.pickupLng
      );
      return { ...booking.toJSON(), distanceFromDriver: distance };
    });

    // Sort by distance and creation time
    nearbyBookings.sort((a, b) => a.distanceFromDriver - b.distanceFromDriver || 
                                 new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(nearbyBookings);
  } catch (error) {
    console.error('Error fetching nearby bookings:', error);
    res.status(500).json({ message: 'Failed to get nearby bookings', error: error.message });
  }
};


// Get history of bookings for driver
exports.getHistoryBookings = async (req, res) => {
  try {
    const driverId = req.user.uid;
    
    // Get driver's vehicle
    const vehicle = await Vehicle.findOne({ 
      where: { driver_id: driverId },
      include: [
        { model: VehicleType, as: 'vehicleType' }
      ]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found for this driver' });
    }

    const bookings = await TaxiBooking.findAll({
      where: { 
        status: ['ride_completed', 'cancelled'],
        vehicleId: vehicle.id
      },
      include: [
        { model: User, as: 'traveler'},
        {
          model: Vehicle, 
          as: 'assignedVehicle',
          include: [
            { model: VehicleType, as: 'vehicleType'}
          ]
        }
      ],
      order: [['completed_at', 'DESC']] // Show most recent first
    });

    console.log(`Fetched ${bookings.length} history bookings for driver ${driverId}`);

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching history bookings:', error);
    res.status(500).json({ 
      message: 'Failed to get history bookings', 
      error: error.message 
    });
  }
};



// Get history of bookings for travelers
exports.getTravelerHistoryBookings = async (req, res) => {
  try {
    const userId = req.user.uid;
    

    const bookings = await TaxiBooking.findAll({
      where: { 
        status: ['ride_completed', 'cancelled'],
        
      },
      include: [
        { model: User, as: 'traveler'},
        
      ],
      order: [['completed_at', 'DESC']]
    });


    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching history bookings:', error);
    res.status(500).json({ 
      message: 'Failed to get history bookings', 
      error: error.message 
    });
  }
};




// Get accepted booking details
exports.getAcceptedBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Fetch the booking with associated models
    const booking = await TaxiBooking.findByPk(bookingId, {
      include: [
        { model: User, as: 'traveler' },
        { 
          model: Vehicle, 
          as: 'assignedVehicle', 
          include: [
            { model: User, as: 'driver' },
            { model: VehicleType, as: 'vehicleType' }
          ]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log("Booking Data:", booking); // Log the booking data for debugging

    // Find the driver's vehicle
    const vehicle = await Vehicle.findOne({
      where: { driver_id: req.user.uid },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Driver vehicle not found' });
    }

    // Update the booking with the driver's vehicle ID
    booking.vehicleId = vehicle.id;
    await booking.save(); // Save the updated booking

    console.log("Updated Booking with Vehicle ID:", booking); // Log the updated booking

    // firebase
    // if (process.env.USE_FIREBASE === 'true') {
    //   await admin.firestore().collection('bookings').doc(bookingId).update({
    //     status: 'driver_accepted',
    //     updatedAt: new Date()
    //   });
    // }

    res.status(200).json(booking); // Return the updated booking
  } catch (error) {
    res.status(500).json({ message: 'Failed to get booking', error: error.message });
  }
};




// update booking status
exports.updateTaxiBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;
    
    // Fetch the booking with associated models
    const booking = await TaxiBooking.findByPk(bookingId, {
      include: [
        { 
          model: Vehicle, 
          as: 'assignedVehicle', 
          include: [
            { model: User, as: 'driver' },
            { model: VehicleType, as: 'vehicleType' }
          ]
        }
      ]
    });
    

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const vehicle = booking.assignedVehicle;
    if (!vehicle || vehicle.driver_id !== req.user.uid) {
      return res.status(403).json({ message: 'Unauthorized to update this booking' });
    }
    
    

    // Define allowed status transitions
    const validTransitions = {
      'pending': ['driver_accepted', 'cancelled'],
      'driver_accepted': ['driver_arrived', 'cancelled'],
      'driver_arrived': ['ride_started', 'cancelled'],
      'ride_started': ['ride_completed'],
      'ride_completed': [],
    };

    // if (!validTransitions[booking.status]?.includes(status)) {
    //   return res.status(400).json({ message: 'Invalid status transition' });
    // }

    // Update status and timestamps
    booking.status = status;

    if (status === 'ride_started') {
      booking.startedAt = new Date();
    } else if (status === 'ride_completed') {
      booking.completedAt = new Date();

      // Mark vehicle as available
      await Vehicle.update(
        { isAvailable: true },
        { where: { id: booking.vehicleId } }
      );
    }

    await booking.save();

    // Notification logic
    const notifications = {
      'driver_accepted': { title: 'Driver Accepted', body: 'Your driver is coming!' },
      'driver_arrived': { title: 'Driver Arrived', body: 'Your driver has arrived!' },
      'ride_started': { title: 'Ride Started', body: 'Your ride has started!' },
      'ride_completed': {
        title: 'Ride Completed',
        body: `Your ride has completed! Total fare: ${booking.totalPrice}`,
        data: {
          bookingId: booking.id,
          fare: booking.totalPrice,
          distance: booking.distance
        }
      },
      'cancelled': { title: 'Ride Cancelled', body: 'Your ride was cancelled' }
    };

    if (notifications[status]) {
      await notifyUser(booking.travelerId, notifications[status]);

      if (booking.isShared && booking.travelerIds) {
        const travelerIds = JSON.parse(booking.travelerIds);
        await Promise.all(
          travelerIds.map(id =>
            id !== booking.travelerId ? notifyUser(id, notifications[status]) : Promise.resolve()
          )
        );
      }
    }

    // firebase
    // if (process.env.USE_FIREBASE === 'true') {
    //   await admin.firestore().collection('bookings').doc(bookingId).update({
    //     status: status,
    //     updatedAt: new Date()
    //   });
    // }

    res.status(200).json({ message: 'Status updated', booking });

  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};


exports.getBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await TaxiBooking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    res.status(200).json({ status: booking.status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get status', error: error.message });
  }
};


exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await TaxiBooking.findByPk(bookingId, {
      include: [
        { model: User, as: 'traveler' },
        { 
          model: Vehicle, 
          as: 'assignedVehicle', 
          include: [
            { model: User, as: 'driver' },
            { model: VehicleType, as: 'vehicleType' }
          ]
        }
      ]
    });
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get details', error: error.message });
  }
};