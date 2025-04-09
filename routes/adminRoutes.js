// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { checkPermission } = require('../middlewares/checkPermission');
const { authenticateJWT } = require("../middlewares/auth");
const userController = require('../controllers/userController');

router.get('/users', authenticateJWT,  userController.getAllUsers);  // checkPermission('manage_users'),

module.exports = router;
