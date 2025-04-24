const express = require('express');
const router = express.Router();
const paymentCardController = require('../controllers/paymentCardController');
const { authenticateJWT } = require('../middlewares/auth');

// Define routes for information
router.post('/',authenticateJWT, paymentCardController.createCard); 

router.get('/',authenticateJWT, paymentCardController.getCardDetails);

router.get('/cards/:id', authenticateJWT,paymentCardController.getCardDetailsById);

router.delete('/:id', authenticateJWT, paymentCardController.deleteCardDetails);

module.exports = router;
