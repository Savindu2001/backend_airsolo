const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadProfilePhoto } = require('../middlewares/uploadProfilePhoto'); 

// Define your routes
router.post('/register', userController.createUser); // Create a new user
router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get user by ID
router.put('/:id', userController.updateUser); // Update user
router.delete('/:id', userController.deleteUser); // Delete user

// Route for updating user profile photo
router.put('/:id/profile-photo', uploadProfilePhoto, userController.updateProfilePhoto); 

// Route for deleting user profile photo
router.delete('/:id/profile-photo', userController.deleteProfilePhoto); // Delete user profile photo



// --- --- FireBase

router.post('/forgot-password', userController.forgotPassword);
router.post('/send-verification-email', userController.sendEmailVerification);


module.exports = router;
