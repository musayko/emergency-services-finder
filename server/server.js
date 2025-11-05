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
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Your client's address
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
app.set('trust proxy', 1); // Trust Heroku proxy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "connect-src": ["'self'", "http://localhost:5173", process.env.CLIENT_URL],
    },
  },
}));
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions)); // Use cors for all Express routes

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

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// --- Route Imports & Usage ---
const seekerRoutes = require('./routes/seekerRoutes');
const providerRoutes = require('./routes/providerRoutes');
const jobRoutes = require('./routes/jobRoutes');

app.use('/api/seekers', seekerRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/jobs', jobRoutes);



// --- Start Server ---
server.listen(port, () => {
  // This console.log is helpful for development, so we can keep it.
  console.log(`Server is running on http://localhost:${port}`);
});