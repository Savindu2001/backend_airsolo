const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.post('/', hostelController.createHostel);
router.get('/', hostelController.getAllHostels);
router.get('/:id', hostelController.getHostelById);
router.put('/:id', hostelController.updateHostel);
router.delete('/:id', hostelController.deleteHostel);

module.exports = router;
