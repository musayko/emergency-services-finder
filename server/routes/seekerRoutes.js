// /server/routes/seekerRoutes.js

const express = require('express');
const router = express.Router();
const seekerController = require('../controllers/seekerController');
const { protect } = require('../middleware/authMiddleware'); 

// POST /api/seekers/register
router.post('/register', seekerController.registerSeeker);

// POST /api/seekers/login
router.post('/login', seekerController.loginSeeker);

// Protected route (only logged-in seekers with a valid token can access this)
// GET /api/seekers/profile
router.get('/profile', protect, seekerController.getSeekerProfile);

module.exports = router;