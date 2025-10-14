// /server/controllers/seekerController.js

const db = require('../db/dbConfig.js'); // Import our database connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to handle seeker registration
exports.registerSeeker = async (req, res) => {
  // 1. Destructure the required fields from the request body
  const { full_name, email, password } = req.body;

  // 2. Basic validation: Check if all fields are present
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // 3. Hash the password before storing it
    // The '10' is the salt round - a standard value for strength
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert the new seeker into the database using Knex
    const [newSeeker] = await db('seekers')
      .insert({
        full_name,
        email,
        password_hash: hashedPassword,
      })
      .returning(['id', 'full_name', 'email']); // Return the new user's data (without the hash!)

    // 5. Send a success response
    res.status(201).json({
      message: 'Seeker registered successfully!',
      seeker: newSeeker,
    });
  } catch (error) {
    // 6. Handle errors, such as a duplicate email
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'This email is already in use.' });
    }
    // Handle other potential server errors
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
};

exports.loginSeeker = async (req, res) => {
  // 1. Destructure email and password from the request body
  const { email, password } = req.body;

  // 2. Basic validation: Check if fields are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // 3. Find the seeker in the database by their email
    const seeker = await db('seekers').where({ email }).first();

    // 4. If no seeker is found, send an "invalid credentials" error and STOP
    if (!seeker) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 5. Compare the provided password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, seeker.password_hash);

    // 6. If the passwords don't match, send the same generic error and STOP
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // --- SUCCESS! All checks passed. Now we create the token. ---

    // 7. Create the JWT payload with the user's data
    const payload = {
      id: seeker.id,
      email: seeker.email,
      name: seeker.full_name,
    };

    // 8. Sign the token with your secret key
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 9. Send the final, successful response with the token
    res.status(200).json({
      message: 'Login successful!',
      token: token,
    });

  } catch (error) {
    // Handle any other unexpected server errors
    console.error('Login error:', error); // It's good practice to log the actual error on the server
    res.status(500).json({ error: 'An error occurred during login.' });
  }
};

// Get Seeker Profile (Protected)
exports.getSeekerProfile = async (req, res) => {
  // Thanks to our middleware, `req.user` is now available with the decoded token payload
  const seekerId = req.user.id;
  
  try {
    // Find the seeker in the DB, but exclude the password hash from the result
    const seeker = await db('seekers').where({ id: seekerId }).select('id', 'full_name', 'email').first();

    if (seeker) {
      res.status(200).json(seeker);
    } else {
      res.status(404).json({ error: 'Seeker not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the profile.' });
  }
};