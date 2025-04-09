const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadProfilePhoto } = require('../middlewares/uploadProfilePhoto'); 
const { authenticateJWT } = require("../middleware/auth");
const { checkPermission } = require('../middlewares/checkPermission');


// Define your routes
router.post('/register', userController.createUser); // Create a new user
router.post('/login', userController.loginUser);
router.get('/', authenticateJWT, userController.getAllUsers); // Get all users (protected route)
router.get('/:id', authenticateJWT, userController.getUserById); // Get user by ID (protected route)
router.put('/:id', authenticateJWT, userController.updateUser); // Update user (protected route)
router.delete('/:id', authenticateJWT , checkPermission('manage_users'), userController.deleteUser); // Delete user (protected route)

// Route for updating user profile photo
router.put('/:id/profile-photo', authenticateJWT, uploadProfilePhoto, userController.updateProfilePhoto); 

// Route for deleting user profile photo
router.delete('/:id/profile-photo', authenticateJWT, userController.deleteProfilePhoto); // Delete user profile photo (protected route)

// --- --- FireBase routes
router.post('/forgot-password', userController.forgotPassword); // No auth required
router.post('/send-verification-email', authenticateJWT, userController.sendEmailVerification); // Requires auth

module.exports = router;
