// /server/routes/providerRoutes.js

const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

// POST /api/providers/register
router.post('/register', providerController.registerProvider);

// POST /api/providers/login
router.post('/login', providerController.loginProvider);

module.exports = router;