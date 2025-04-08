// Sample function to calculate total price for taxi booking
const calculateTaxiPrice = async (fromCityId, toCityId, vehicleId, distanceInKm, isShared) => {
  const vehiclePrice = await VehiclePrice.findOne({ where: { vehicleId } });

  if (!vehiclePrice) {
    throw new Error('Vehicle price not found');
  }

  const totalPrice = vehiclePrice.pricePer5Km * (distanceInKm / 5) + vehiclePrice.additionalCharge;

  // If shared, calculate price per person based on number of seats
  if (isShared) {
    const numberOfPassengers = 2; // Example: You can retrieve this from the booking request
    return totalPrice / numberOfPassengers;
  }

  return totalPrice;
};



const calculateTotalPrice = (vehicleType, distance) => {
    let totalPrice = 0;
  
    // First 5 km pricing
    if (distance <= 5) {
      totalPrice = vehicleType.priceFor5Km;
    } else {
      // Price for the first 5 km
      totalPrice = vehicleType.priceFor5Km;
      // Additional kilometers
      const additionalDistance = distance - 5;
      totalPrice += additionalDistance * vehicleType.additionalPricePerKm;
    }
  
    return totalPrice;
  };
  



  const bookingTaxi = async (req, res) => {
    const { vehicleTypeId, distance } = req.body; // Assume distance is in kilometers
  
    try {
      // Fetch vehicle type from the database
      const vehicleType = await VehicleType.findByPk(vehicleTypeId);
      if (!vehicleType) {
        return res.status(404).json({ message: 'Vehicle type not found' });
      }
  
      // Calculate the total price
      const totalPrice = calculateTotalPrice(vehicleType, distance);
  
      // Proceed with booking logic, e.g., save the booking to the database
      // ...
  
      return res.status(200).json({ totalPrice });
    } catch (error) {
      console.error('Error booking taxi:', error);
      return res.status(500).json({ message: 'Failed to book taxi', error: error.message });
    }
  };
  