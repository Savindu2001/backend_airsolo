const express = require('express');
const {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} = require('../controllers/cityController');
const { authenticateJWT } = require('../middlewares/auth');
const { uploadCityImages, uploadToS3 } = require('../middlewares/uploadCityPhoto');

const router = express.Router();

router.post('/',uploadCityImages, uploadToS3,authenticateJWT, createCity);
router.get('/',authenticateJWT, getAllCities);
router.get('/:id',authenticateJWT, getCityById);
router.put('/:id',authenticateJWT, updateCity);
router.delete('/:id',authenticateJWT, deleteCity);

module.exports = router;
