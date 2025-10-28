// /server/routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');


// POST /api/jobs (for Seekers to submit a job)
router.post('/', protect, upload.single('image'), jobController.submitJob);

// GET /api/jobs/open (for Providers to see available jobs)
router.get('/open', protect, jobController.getOpenJobs);

// GET /api/jobs/my-jobs (for a Provider to see their claimed jobs)
router.get('/my-jobs', protect, jobController.getProviderJobs);

// --- VVV ADD THIS NEW ROUTE VVV ---
// PUT /api/jobs/:id/claim (for a Provider to claim a job)
router.put('/:id/claim', protect, jobController.claimJob);

module.exports = router;