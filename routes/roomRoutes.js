const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { uploadRoomImages, uploadToS3 } = require('../middlewares/uploadRoomPhotos');

router.post('/', uploadRoomImages,uploadToS3,roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.get('/hostel/:hostel_id', roomController.getRoomByHostelId);

router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);
router.post('/availability', roomController.checkRoomAvailability);

module.exports = router;
