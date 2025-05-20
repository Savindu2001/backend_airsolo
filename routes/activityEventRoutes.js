const express = require('express');
const router = express.Router();
const activityEventController = require('../controllers/activityEventController');

// Create a new activity event
router.post('/create', activityEventController.createActivityEvent);

// Get all activity events
router.get('/', activityEventController.getAllActivityEvents);

// Get a single activity event by ID
router.get('/:id', activityEventController.getActivityEventById);

// Update an activity event
router.put('/:id', activityEventController.updateActivityEvent);

// Delete an activity event
router.delete('/:id', activityEventController.deleteActivityEvent);

module.exports = router;
