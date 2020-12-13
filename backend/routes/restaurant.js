const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/RestaurantController');

router.get('/restaurants', AuthController.all);
router.post('/restaurants', AuthController.add);

module.exports = router;