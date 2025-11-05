// /server/config/multerConfig.js

const multer = require('multer');

// Set up storage in memory
const storage = multer.memoryStorage();

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;