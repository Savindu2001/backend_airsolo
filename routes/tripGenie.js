const express = require('express');
const router = express.Router();
const { getPlaceGuide , getTripPlan} = require('../controllers/tripGenieController'); 


router.post('/guide', getPlaceGuide); 
router.post('/trip', getTripPlan);

module.exports = router;
