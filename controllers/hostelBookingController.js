const { HostelBooking } = require('../models');


// Make a Hostel Booking
const createBooking = async (req, res) => {
  try {
    console.log('📥 Request Body:', req.body); // log body
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

    if (!userId || !hostelId || !roomId) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ message: 'Missing required fields' });
      }

    const booking = await HostelBooking.create({
      userId,
      hostelId,
      roomId,
      bedType,
      checkInDate,
      checkOutDate,
      numGuests,
      specialRequests,
    });
    console.log('✅ Booking saved:', booking);
    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};


// Update Hostel Booking Status
const updateBookingStatus = async (req, res) => {
    try {
      const { id } = req.params; // Get booking ID from URL parameters
      const { status } = req.body; // Get new status from request body
  
      // Validate the status (optional)
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
  updateBookingStatus
};
