const express = require('express');
const router = express.Router();
const { uploadDocuments } = require('../middlewares/uploadDocuments');
const { submitVerification } = require('../controllers/hostVerificationController');

// Route with user ID as a parameter
router.post('/:id/verify', uploadDocuments, submitVerification); 

module.exports = router;
