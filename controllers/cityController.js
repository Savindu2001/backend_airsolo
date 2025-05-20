// controllers/cityController.js
const { City } = require('../models');

// Create a new city
const createCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({ message: 'City created successfully', city });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create city', error });
  }
};

// Get all cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cities', error });
  }
};

// Get a city by ID
const getCityById = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await City.findByPk(id);
    if (city) {
      res.status(200).json(city);
    } else {
      res.status(404).json({ message: 'City not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch city', error });
  }
};

// Update a city
const updateCity = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await City.findByPk(id);
    if (city) {
      await city.update(req.body);
      res.status(200).json({ message: 'City updated successfully', city });
    } else {
      res.status(404).json({ message: 'City not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update city', error });
  }
};

// Delete a city
const deleteCity = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await City.findByPk(id);
    if (city) {
      await city.destroy();
      res.status(200).json({ message: 'City deleted successfully' });
    } else {
      res.status(404).json({ message: 'City not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete city', error });
  }
};

module.exports = {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
};
