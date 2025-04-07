const express = require('express');
const {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} = require('../controllers/cityController');

const router = express.Router();

router.post('/', createCity);
router.get('/', getAllCities);
router.get('/:id', getCityById);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

module.exports = router;
