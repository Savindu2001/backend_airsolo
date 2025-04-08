const express = require('express');
const router = express.Router();
const { getPlaceGuide , getTripPlan, downloadTripPlanPDF} = require('../controllers/tripGenieController'); 


router.post('/guide', getPlaceGuide); 
router.post('/trip', getTripPlan);
router.post('/trip/download-pdf', downloadTripPlanPDF);

module.exports = router;
