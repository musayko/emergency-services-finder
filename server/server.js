require('dotenv').config();

const express = require('express');
const path = require('path'); 
const app = express();
const cors = require('cors'); 

// VVV THIS IS THE LIKELY MISSING LINE VVV
const port = process.env.PORT || 5001; // Defines the port for our server

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- Import Routes ---
const seekerRoutes = require('./routes/seekerRoutes');
const providerRoutes = require('./routes/providerRoutes');
const jobRoutes = require('./routes/jobRoutes');

// --- Serve Static Files ---
// This makes the 'uploads' folder accessible via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Use Routes ---
app.use('/api/seekers', seekerRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/jobs', jobRoutes);


// --- Basic Welcome Route ---
app.get('/', (req, res) => {
  res.send('Welcome to the 24/7 Emergency Finder API!');
});

// --- Start the Server ---
// Now, the 'port' variable exists and can be used here
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});