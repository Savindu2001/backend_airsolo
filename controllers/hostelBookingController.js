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
      amount,
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
          [Op.lt]: checkOutDate, 
        },
        checkOutDate: {
          [Op.gt]: checkInDate, 
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
      amount,
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


// Get User Bookings
const getAllBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find bookings for the specific user
    const bookings = await HostelBooking.findAll({
      where: { userId },
      include: [{
        model: Room,
        attributes: ['id', 'name', 'type', 'price_per_person']
      }]
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    return res.status(200).json(bookings); 
  } catch (error) {
    console.error('Error fetching user bookings:', error); 
    return res.status(500).json({ 
      message: 'An error occurred while fetching user bookings', 
      error: error.message 
    });
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



// Confirm Booking after Payment
const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await HostelBooking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update status to confirmed
    booking.status = 'confirmed';
    await booking.save();

    // Here you would typically:
    // 1. Send confirmation email
    // 2. Update any related records
    // 3. Process any post-booking logic

    return res.status(200).json({ 
      message: 'Booking confirmed successfully',
      booking 
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    return res.status(500).json({ 
      message: 'Failed to confirm booking',
      error: error.message 
    });
  }
};

// PayHere Webhook Handler
const handlePaymentWebhook = async (req, res) => {
  try {
    const { bookingId, paymentStatus } = req.body;
    
    if (paymentStatus !== 'success') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const booking = await HostelBooking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'confirmed';
    await booking.save();

    return res.status(200).json({ message: 'Booking status updated' });
  } catch (error) {
    console.error('Error handling payment webhook:', error);
    return res.status(500).json({ 
      message: 'Failed to process payment notification',
      error: error.message 
    });
  }
};



module.exports = {
  createBooking,
  getAllBookingsByUserId,
  confirmBooking,
  handlePaymentWebhook,
  updateBookingStatus,
  getAllBookings
};
