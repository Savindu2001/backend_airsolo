const { HostelBooking, Room } = require('../models'); // Ensure Room is imported
const { Op } = require('sequelize'); // Import Sequelize operators for querying

// Make a Hostel Booking
const createBooking = async (req, res) => {
  try {
    console.log('📥 Request Body:', req.body); // Log request body
    const {
      userId,
      hostelId,
      roomId,
      bedType,
      checkInDate,
      checkOutDate,
      numGuests,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!userId || !hostelId || !roomId) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check room availability
    const existingBookings = await HostelBooking.findAll({
      where: {
        roomId,
        checkInDate: {
          [Op.lt]: checkOutDate, // Current check-in date must be before desired check-out date
        },
        checkOutDate: {
          [Op.gt]: checkInDate, // Current check-out date must be after desired check-in date
        },
      },
    });

    // If there are existing bookings, the room is not available
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for the selected dates' });
    }

    // Proceed to create the booking
    const booking = await HostelBooking.create({
      userId,
      hostelId,
      roomId,
      bedType,
      checkInDate,
      checkOutDate,
      numGuests,
      specialRequests,
      status: 'pending', // Default status
    });

    console.log('✅ Booking saved:', booking);
    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};


// Get All Booking List 
const getAllBookings = async (req, res) => {
    try {
      const bookings = await HostelBooking.findAll(); 
      return res.status(200).json(bookings); 
    } catch (error) {
      console.error('Error fetching bookings:', error); 
      return res.status(500).json({ message: 'An error occurred while fetching bookings', error: error.message });
    }
  };
  

// Update Hostel Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get booking ID from URL parameters
    const { status } = req.body; // Get new status from request body

    // Validate the status
    const validStatuses = ['pending', 'confirmed', 'canceled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the booking
    const booking = await HostelBooking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the status
    booking.status = status;
    await booking.save();

    return res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({ message: 'An error occurred while updating the booking status', error });
  }
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getAllBookings
};
