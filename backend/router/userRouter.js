const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/userDetails', authMiddleware, userController.userDetailsController);
router.post('/signup', userController.signupController);

module.exports = router;