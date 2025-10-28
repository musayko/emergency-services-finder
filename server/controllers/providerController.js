// /server/controllers/providerController.js

const db = require('../db/dbConfig.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// --- Register a new Provider ---
exports.registerProvider = async (req, res) => {
  const { business_name, email, password, service_category } = req.body;

  if (!business_name || !email || !password || !service_category) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newProvider] = await db('providers')
      .insert({
        business_name,
        email,
        password_hash: hashedPassword,
        service_category,
      })
      .returning(['id', 'business_name', 'email', 'service_category']);

    res.status(201).json({
      message: 'Provider registered successfully!',
      provider: newProvider,
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'This email is already in use.' });
    }
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
};

// --- Login a Provider ---
exports.loginProvider = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const provider = await db('providers').where({ email }).first();
    if (!provider) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, provider.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Create JWT payload for the provider
    const payload = {
      id: provider.id,
      email: provider.email,
      name: provider.business_name,
      category: provider.service_category,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful!',
      token: token,
    });

  } catch (error) {
    console.error('Provider login error:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
};