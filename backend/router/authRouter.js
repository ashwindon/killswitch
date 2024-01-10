const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/login', authController.loginController);
router.get('/logout', authController.logoutController);

module.exports = router;