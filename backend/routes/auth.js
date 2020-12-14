const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const authenticate = require('../middleware/authentification');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/userData/:id', authenticate, AuthController.userData);

module.exports = router;