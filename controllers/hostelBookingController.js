const { HostelBooking } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      hostelId,
      roomId,
      checkInDate,
      checkOutDate,
      numGuests,
      specialRequests,
      bedType,
    } = req.body;

    const newBooking = await HostelBooking.create({
      id: uuidv4(),
      userId,
      hostelId,
      roomId,
      checkInDate,
      checkOutDate,
      numGuests,
      specialRequests,
      bedType,
      status: 'pending'
    });

    return res.status(201).json({ message: 'Booking created', booking: newBooking });
  } catch (error) {
    console.error('Create Booking Error:', error);
    return res.status(500).json({ message: 'Error creating booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await HostelBooking.findAll({ where: { userId } });
    return res.json({ bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    return res.status(500).json({ message: 'Error fetching bookings' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await HostelBooking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    return res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Update Status Error:', error);
    return res.status(500).json({ message: 'Error updating booking' });
  }
};
