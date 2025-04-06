const express = require('express');
const router = express.Router();
const houseRuleController = require('../controllers/houseRuleController');

// House rule routes
router.post('/', houseRuleController.createHouseRule);
router.get('/', houseRuleController.getAllHouseRules);
router.get('/:id', houseRuleController.getHouseRuleById);
router.put('/:id', houseRuleController.updateHouseRule);
router.delete('/:id', houseRuleController.deleteHouseRule);

module.exports = router;
