const { getTouristGuideDetails, getTripDetails } = require('../services/openaiService');


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

module.exports = { getPlaceGuide , getTripPlan };
