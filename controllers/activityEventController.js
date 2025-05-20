'use strict';

const { ActivityEvent } = require('../models');

// Create a new activity event
exports.createActivityEvent = async (req, res) => {
  try {
    const { name, description, cityId, available_days, contact, activity_type } = req.body;

    if (!name || !cityId || !activity_type) {
      return res.status(400).json({ message: 'Name, City ID, and Activity Type are required.' });
    }

    // Convert available_days array to a comma-separated string
    const availableDaysString = Array.isArray(available_days) ? available_days.join(', ') : available_days;

    const activityEvent = await ActivityEvent.create({
      name,
      description,
      cityId,
      available_days : availableDaysString,
      contact,
      activity_type,
    });

    return res.status(201).json({ message: 'Activity event created successfully', activityEvent });
  } catch (error) {
    console.error('Error creating activity event:', error);
    return res.status(500).json({ message: 'An error occurred while creating the activity event', error: error.message });
  }
};

// Get all activity events
exports.getAllActivityEvents = async (req, res) => {
  try {
    const activityEvents = await ActivityEvent.findAll();
    return res.status(200).json(activityEvents);
  } catch (error) {
    console.error('Error retrieving activity events:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving activity events', error: error.message });
  }
};

// Get a single activity event by ID
exports.getActivityEventById = async (req, res) => {
  try {
    const activityEvent = await ActivityEvent.findByPk(req.params.id);
    if (!activityEvent) {
      return res.status(404).json({ message: 'Activity event not found' });
    }
    return res.status(200).json(activityEvent);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Update an activity event
exports.updateActivityEvent = async (req, res) => {
  try {
    const activityEvent = await ActivityEvent.findByPk(req.params.id);
    if (!activityEvent) {
      return res.status(404).json({ message: 'Activity event not found' });
    }
    await activityEvent.update(req.body);
    return res.status(200).json( {message: 'Activity updated successfully',activityEvent});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete an activity event
exports.deleteActivityEvent = async (req, res) => {
  try {
    const activityEvent = await ActivityEvent.findByPk(req.params.id);
    if (!activityEvent) {
      return res.status(404).json({ message: 'Activity event not found' });
    }
    await activityEvent.destroy();
    return res.status(200).json({ message: 'City deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
