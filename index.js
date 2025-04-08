require("dotenv").config();  // Load environment variables from .env file
const express = require('express'); // Import express
const cors = require('cors');  // Import cors for Cross-Origin Resource Sharing
const app = express(); // Create an Express application
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const houseRuleRoutes = require('./routes/houseRuleRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const hostVerificationRoutes = require('./routes/hostVerification');
const hostelBookingRoutes = require('./routes/hostelBooking');
const cityRoutes = require('./routes/cityRoutes');
const informationRoutes = require('./routes/informationRoutes');
const activityEventRoutes = require('./routes/activityEventRoutes');
const taxiPriceRoutes = require('./routes/taxiPriceRoutes');
const tripGenieRoutes = require('./routes/tripGenie'); 
const taxiBookingRoutes = require('./routes/taxiBookingRoutes');


// Enable CORS for all routes
app.use(cors());  

// Middleware to parse JSON requests
app.use(express.json()); 
app.use(bodyParser.json());

// Example GET route
app.get('/', (req, res) => {
    res.send('Welcome to the AirSolo API!');
  });



// Set Route Paths
app.use('/api/users', userRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/house-rules', houseRuleRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/host', hostVerificationRoutes); 
app.use('/api/bookings', hostelBookingRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/information', informationRoutes);
app.use('/api/activity-events', activityEventRoutes);
app.use('/api/taxi-price', taxiPriceRoutes);
app.use('/api/tripgenie', tripGenieRoutes);
app.use('/api/taxi-bookings', taxiBookingRoutes);


// Server Setup
const PORT = process.env.PORT || 3000; // Set the port, fallback to 3000 if not defined in .env

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log the server startup
});


