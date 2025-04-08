const { Vehicle, VehicleType, TaxiBooking, User } = require('../models');
const { Op } = require('sequelize');

// Function to calculate total price
const calculateTotalPrice = (vehicleType, distance, isShared, seatsToShare) => {
    let totalPrice = 0;

    if (distance <= 5) {
        totalPrice = parseFloat(vehicleType.priceFor5Km);
    } else {
        const additionalDistance = distance - 5;
        totalPrice = parseFloat(vehicleType.priceFor5Km) + (additionalDistance * parseFloat(vehicleType.additionalPricePerKm));
    }

    return isShared && seatsToShare > 0 ? totalPrice / seatsToShare : totalPrice;
};

// 🚕 Booking a new taxi (shared or private)
const bookingTaxi = async (req, res) => {
  const { vehicleId, travelerId, distance, isShared, seatsToShare = 1 } = req.body;

  try {
      const vehicle = await Vehicle.findByPk(vehicleId, {
          include: [{ model: VehicleType }],
      });

      if (!vehicle) {
          return res.status(404).json({ message: 'Vehicle not found' });
      }

      const vehicleType = vehicle.VehicleType;
      if (!vehicleType) {
          return res.status(404).json({ message: 'Vehicle type not found' });
      }

      const totalSeats = vehicle.number_of_seats;

      // If shared, check existing shared bookings
      if (isShared) {
          const existingBookings = await TaxiBooking.findAll({
              where: {
                  vehicleId,
                  status: 'pending',
                  isShared: true,
              }
          });

          const alreadyBookedSeats = existingBookings.reduce((sum, b) => sum + b.bookedSeats, 0);

          if ((seatsToShare + alreadyBookedSeats) > totalSeats) {
              return res.status(400).json({
                  message: `Only ${totalSeats - alreadyBookedSeats} seat(s) are available for sharing.`,
              });
          }
      } else if (seatsToShare > totalSeats) {
          return res.status(400).json({ message: `Vehicle only supports ${totalSeats} seats.` });
      }

      const totalPrice = calculateTotalPrice(vehicleType, distance, isShared, seatsToShare);

      const newBooking = await TaxiBooking.create({
          travelerId,
          vehicleId,
          distance,
          totalPrice,
          isShared,
          seatsToShare,
          bookedSeats: seatsToShare,
          travelerIds: isShared ? [travelerId] : [travelerId], // Save traveler ID in an array
          bookingDate: new Date(), // Current date/time
          status: 'pending',
      });

      return res.status(201).json({
          message: 'Taxi booked successfully',
          booking: newBooking,
      });
  } catch (error) {
      console.error('Error booking taxi:', error);
      return res.status(500).json({ message: 'Failed to book taxi', error: error.message });
  }
};

// Controller to update booking status
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params; // Get booking ID from URL
  const { status } = req.body; // Expected new status (e.g., 'confirmed')

  try {
    const booking = await TaxiBooking.findByPk(bookingId); // Corrected from Booking to TaxiBooking
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      booking.status = status; // Update the booking status
      await booking.save();

      return res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
      console.error('Error updating booking status:', error);
      return res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
};


// ✅ Get all shared bookings with available seats
const getAvailableSharedBookings = async (req, res) => {
    try {
        const bookings = await TaxiBooking.findAll({
            where: {
                isShared: true,
                status: 'pending',
            },
            include: [{ model: Vehicle }],
        });

        const filtered = bookings.filter(b => {
            const totalSeats = b.Vehicle.number_of_seats;
            return b.bookedSeats < totalSeats;
        });

        return res.status(200).json({ sharedBookings: filtered });
    } catch (error) {
        console.error('Error fetching shared bookings:', error);
        return res.status(500).json({ message: 'Failed to fetch shared bookings' });
    }
};

// ✅ Join existing shared booking
const joinSharedBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { travelerId, seatsToBook } = req.body;

  try {
      const booking = await TaxiBooking.findByPk(bookingId);

      if (!booking || !booking.isShared || booking.status !== 'pending') {
          return res.status(404).json({ message: 'Shared booking not found or unavailable' });
      }

      const totalSeats = booking.bookedSeats + seatsToBook;

      if (totalSeats > booking.number_of_seats) {
          return res.status(400).json({
              message: `Only ${booking.number_of_seats - booking.bookedSeats} seats are left in this shared booking.`,
          });
      }

      // Ensure travelerIds is an array
      if (!Array.isArray(booking.travelerIds)) {
          booking.travelerIds = JSON.parse(booking.travelerIds); // Parse if it's a string
      }

      // Update the booking to include the new traveler
      booking.bookedSeats += seatsToBook;
      booking.travelerIds.push(travelerId); // Add traveler ID to array
      await booking.save();

      return res.status(200).json({ message: 'Successfully joined shared booking', booking });
  } catch (error) {
      console.error('Error joining shared booking:', error);
      return res.status(500).json({ message: 'Failed to join shared booking', error: error.message });
  }
};



module.exports = {
    bookingTaxi,
    updateBookingStatus,
    getAvailableSharedBookings,
    joinSharedBooking,
};
