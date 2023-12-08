const express = require('express');
const authController = require('../controllers/authController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const router = express.Router();

router.post('/usuarios', authController.createUsuario);
router.post('/login', authController.login);

module.exports = router;
