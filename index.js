require("dotenv").config();  // Load environment variables from .env file
const express = require('express'); // Import express
const cors = require('cors');  // Import cors for Cross-Origin Resource Sharing
const app = express(); // Create an Express application
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Enable CORS for all routes
app.use(cors());  

// Middleware to parse JSON requests
app.use(express.json()); 

// Example GET route
app.get('/', (req, res) => {
    res.send('Hello world!'); // Basic response for root URL
});

// Set Route Paths
app.use('/api/users', userRoutes); // Use user routes under the /api/users endpoint

// Server Setup
const PORT = process.env.PORT || 3000; // Set the port, fallback to 3000 if not defined in .env

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log the server startup
});
