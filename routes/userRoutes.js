const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const emailController = require('../controllers/emailController');
const { uploadProfilePhoto } = require('../middlewares/uploadProfilePhoto'); 
const { authenticateJWT } = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');



router.post('/register', userController.createUser); 
router.post('/login', userController.loginUser);
router.get('/', authenticateJWT, checkRole(['traveler']), userController.getAllUsers); 
router.get('/:id', authenticateJWT, checkRole(['admin']),  userController.getUserById); 
router.put('/:id', authenticateJWT, checkRole(['admin']),  userController.updateUser); // Update user (protected route)
router.delete('/:id', authenticateJWT , checkRole(['admin']),  userController.deleteUser); // Delete user (protected route)

// Route for updating user profile photo
router.put('/:id/profile-photo', authenticateJWT, uploadProfilePhoto, userController.updateProfilePhoto); 

// Route for deleting user profile photo
router.delete('/:id/profile-photo', authenticateJWT, userController.deleteProfilePhoto); // Delete user profile photo (protected route)

// --- --- FireBase routes
router.post('/forgot-password', userController.forgotPassword); // No auth required
router.post('/send-verification-email', authenticateJWT, emailController.sendEmailVerification); // Requires auth




module.exports = router;
