require("dotenv").config();  
const express = require('express');
const cors = require('cors');  
const app = express();

// Enable CORS for all routes
app.use(cors());  

// Middleware to parse JSON requests
app.use(express.json());

// Example GET route
app.get('/', (req, res) => {
    res.send('Hello world!');
})

// Server Steup
// Set the port
const PORT = process.env.DB_PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
