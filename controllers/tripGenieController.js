const { getTouristGuideDetails, getTripDetails } = require('../services/openaiService');
const { generatePDF } = require('../services/pdfService');


// Ai Feature 1 - Place Guide
const getPlaceGuide = async (req, res) => {
  const { currentLocation } = req.body;

  try {
    const guideDetails = await getTouristGuideDetails(currentLocation);
    return res.status(200).json({ guideDetails });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tourist guide details', error: error.message });
  }
};


// Ai Feature 1 - Trip Maker
const getTripPlan = async (req, res) => {
    const { startCity , startDate, endDate , tripType, numberOfGuest } = req.body;
  
    try {
      const tripDetails = await getTripDetails(startCity  , startDate, endDate , tripType, numberOfGuest);
      return res.status(200).json({ tripDetails });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch tourist trip details', error: error.message });
    }
  };



// if need save trip details it convert as pdf
const downloadTripPlanPDF = async (req, res) => {
  const { startCity, startDate, endDate, tripType, numberOfGuest } = req.body;

  try {
    // Get trip details from OpenAI
    const tripDetails = await getTripDetails(startCity, startDate, endDate, tripType, numberOfGuest);

    // Generate PDF using the trip details
    const pdfDoc = generatePDF('TripGenie Travel Plan', tripDetails);

    // Set headers for PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=TripGenie-Plan.pdf');

    pdfDoc.pipe(res); // Pipe the PDF document to the response
    pdfDoc.end(); // End the PDF document
  } catch (err) {
    console.error('Error generating trip plan or PDF:', err);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

module.exports = { getPlaceGuide , getTripPlan , downloadTripPlanPDF};






