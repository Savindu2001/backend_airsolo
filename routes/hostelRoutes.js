const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const { uploadHostelImages, uploadToS3 } = require('../middlewares/uploadHostelImage');


router.post('/create', uploadHostelImages, uploadToS3, hostelController.createHostel); // Route to create a new hostel
router.get('/', hostelController.getAllHostels);
router.get('/:id', hostelController.getHostelById);
router.put('/:id', hostelController.updateHostel);
router.delete('/:id', hostelController.deleteHostel);

module.exports = router;
