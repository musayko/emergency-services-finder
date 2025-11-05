// --- Imports ---
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// --- Environment & Config ---
require('dotenv').config();

// --- Environment Variable Check ---
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

// --- App & Server Initialization ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your client's address
    methods: ['GET', 'POST'],
  },
});

// Make the io instance available to all routes
app.locals.io = io;

// --- Socket.IO Connection Handler ---
io.on('connection', (socket) => {
  // You can add connection-specific logic here if needed
  socket.on('disconnect', () => {
    // And disconnection logic here
  });
});

// --- Global Middleware ---
const port = process.env.PORT || 5001;
app.use(helmet());
app.use(cors()); // Use cors for all Express routes

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(express.json());

// --- Static File Serving ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// --- Route Imports & Usage ---
const seekerRoutes = require('./routes/seekerRoutes');
const providerRoutes = require('./routes/providerRoutes');
const jobRoutes = require('./routes/jobRoutes');

app.use('/api/seekers', seekerRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/jobs', jobRoutes);

// --- Basic Welcome Route ---
app.get('/', (req, res) => {
  res.send('Welcome to the 24/7 Emergency Finder API!');
});

// --- Start Server ---
server.listen(port, () => {
  // This console.log is helpful for development, so we can keep it.
  console.log(`Server is running on http://localhost:${port}`);
});