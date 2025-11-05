// /server/controllers/jobController.js

const aiService = require('../services/aiService');
const db = require('../db/dbConfig.js'); // Make sure you've imported your DB connection
const { sendEmail } = require('../services/emailService');

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

    // --- STAGE 2: CLASSIFICATION ---
    const classificationResult = await aiService.runClassification(
      imageFile.path,
      imageFile.mimetype,
      description
    );

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
    
    // Emit new job event via Socket.IO
    req.app.locals.io.emit('newJob', createdJob);

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

    // Send email notification to seeker
    try {
      const seeker = await db('seekers').where({ id: updatedJob.seeker_id }).first();
      if (seeker && seeker.email) {
        await sendEmail(
          seeker.email,
          'Your Emergency Job Has Been Claimed!',
          `Good news! Your emergency job "${updatedJob.ai_identified_problem}" has been claimed by a provider. They will be in touch shortly.`, 
          `<p>Good news! Your emergency job "<strong>${updatedJob.ai_identified_problem}</strong>" has been claimed by a provider. They will be in touch shortly.</p>`
        );
      }
    } catch (emailError) {
      console.error('Error sending email after job claim:', emailError);
    }

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
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};

exports.getSeekerJobs = async (req, res) => {
  const seekerId = req.user.id;

  try {
    const jobs = await db('jobs')
      .where({ seeker_id: seekerId })
      .orderBy('created_at', 'desc');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching seeker jobs:', error);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};

exports.updateJobStatus = async (req, res) => {
  const providerId = req.user.id;
  const { id: jobId } = req.params;
  const { status } = req.body;

  if (!req.user.category) {
    return res.status(403).json({ error: 'Access denied. Only providers can update jobs.' });
  }

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    const job = await db('jobs').where({ id: jobId, provider_id: providerId }).first();

    if (!job) {
      return res.status(404).json({ error: 'Job not found or you are not assigned to it.' });
    }

    const [updatedJob] = await db('jobs')
      .where({ id: jobId })
      .update({
        status: status,
        updated_at: db.fn.now(),
      })
      .returning('*');

    res.status(200).json({
      message: 'Job status updated successfully!',
      job: updatedJob,
    });

    // Send email notification to seeker
    try {
      const seeker = await db('seekers').where({ id: updatedJob.seeker_id }).first();
      if (seeker && seeker.email) {
        await sendEmail(
          seeker.email,
          `Your Emergency Job Status Updated to ${updatedJob.status.replace('_', ' ').toUpperCase()}`,
          `Your emergency job "${updatedJob.ai_identified_problem}" has been updated to status: ${updatedJob.status.replace('_', ' ')}.`,
          `<p>Your emergency job "<strong>${updatedJob.ai_identified_problem}</strong>" has been updated to status: <strong>${updatedJob.status.replace('_', ' ')}</strong>.</p>`
        );
      }
    } catch (emailError) {
      console.error('Error sending email after job status update:', emailError);
    }
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ error: 'An internal error occurred while updating the job status.' });
  }
};