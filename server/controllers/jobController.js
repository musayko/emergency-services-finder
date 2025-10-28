// /server/controllers/jobController.js

const aiService = require('../services/aiService');
const db = require('../db/dbConfig.js'); // Make sure you've imported your DB connection

exports.submitJob = async (req, res) => {
  const { description } = req.body;
  const imageFile = req.file;
  const seekerId = req.user.id;

  if (!description || !imageFile) {
    return res.status(400).json({ error: 'Description and image are required.' });
  }

  try {
    // --- STAGE 1: SAFEGUARD CHECK ---
    const safeguardResult = await aiService.runSafeguardCheck(
      imageFile.path,
      imageFile.mimetype,
      description
    );

    if (!safeguardResult.isValid) {
      // (Optional) Here you could add code to delete the invalid uploaded image from the /uploads folder.
      return res.status(400).json({ error: `Submission rejected: ${safeguardResult.reason}` });
    }
    console.log('--- Job Submission Passed Safeguard ---');

    // --- STAGE 2: CLASSIFICATION ---
    const classificationResult = await aiService.runClassification(
      imageFile.path,
      imageFile.mimetype,
      description
    );
    console.log('--- AI Classification Complete ---');
    console.log(classificationResult);

    // --- STAGE 3: DATABASE INSERTION ---
    const newJob = {
      user_description: description,
      image_url: imageFile.path, // Store the path to the image
      ai_identified_problem: classificationResult.title,
      ai_identified_category: classificationResult.category,
      seeker_id: seekerId,
      status: 'open', // Default status for a new job
    };

    const [createdJob] = await db('jobs').insert(newJob).returning('*');
    console.log('--- Job Saved to Database ---');
    console.log(createdJob);
    
    // --- FINAL RESPONSE ---
    res.status(201).json({
      message: 'Job submitted and classified successfully!',
      job: createdJob,
    });

  } catch (error) {
    console.error("Error during job submission:", error);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};

exports.getOpenJobs = async (req, res) => {
  // 1. Get the provider's info from the decoded JWT (attached by our 'protect' middleware)
  // We assume the provider's JWT payload includes their service category.
  const providerCategory = req.user.category;
  
  // 2. Security Check: Ensure the user is a provider with a category.
  // A seeker's token won't have a 'category' field.
  if (!providerCategory) {
    return res.status(403).json({ error: 'Access denied. Only providers can view jobs.' });
  }

  try {
    // 3. Query the database for jobs that meet two conditions:
    //    - The status is 'open'
    //    - The 'ai_identified_category' matches the logged-in provider's category
    const openJobs = await db('jobs')
      .where({
        status: 'open',
        ai_identified_category: providerCategory
      })
      .orderBy('created_at', 'desc'); // Show the newest jobs first

    // 4. Send the list of jobs as the response
    res.status(200).json(openJobs);

  } catch (error) {
    console.error("Error fetching open jobs:", error);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};
exports.claimJob = async (req, res) => {
  // 1. Get the provider's info from the decoded JWT
  const providerId = req.user.id;
  const providerCategory = req.user.category;

  // 2. Get the job ID from the URL parameters
  const { id: jobId } = req.params;

  // 3. Security Check: Ensure the user is a provider.
  if (!providerCategory) {
    return res.status(403).json({ error: 'Access denied. Only providers can claim jobs.' });
  }

 try {
    const job = await db('jobs').where({ id: jobId }).first();
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    // Check qualification BEFORE checking status
    if (job.ai_identified_category !== providerCategory) {
      return res.status(403).json({ error: 'You are not qualified to claim this job.' });
    }
    if (job.status !== 'open') {
      return res.status(409).json({ error: 'Job is not open and cannot be claimed.' });
    }

    // 6. If all checks pass, update the job
    const [updatedJob] = await db('jobs')
      .where({ id: jobId })
      .update({
        status: 'claimed',
        provider_id: providerId,
        updated_at: db.fn.now(), // Update the timestamp
      })
      .returning('*'); // Return the fully updated job object

    // 7. Send the successful response
    res.status(200).json({
      message: 'Job claimed successfully!',
      job: updatedJob,
    });

  } catch (error) {
    console.error("Error claiming job:", error);
    res.status(500).json({ error: 'An internal error occurred while claiming the job.' });
  }
};

exports.getProviderJobs = async (req, res) => {
  // 1. Get the provider's ID from the JWT
  const providerId = req.user.id;
  
  // 2. Security Check: Make sure the user is a provider
  if (!req.user.category) {
    return res.status(403).json({ error: 'Access denied. Only providers can view their jobs.' });
  }

  try {
    // 3. Query the database for jobs assigned to this provider
    const myJobs = await db('jobs')
      .where({ provider_id: providerId })
      // Optionally, filter out completed jobs if you want
      // .whereNot({ status: 'completed' }) 
      .orderBy('updated_at', 'desc');

    // 4. Send the list of jobs
    res.status(200).json(myJobs);

  } catch (error) {
    console.error("Error fetching provider's jobs:", error);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};