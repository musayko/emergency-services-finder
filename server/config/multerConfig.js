// /server/config/multerConfig.js

const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  // Define the destination folder for the files
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Define how the files should be named
  filename: (req, file, cb) => {
    // We create a unique filename to prevent overwriting
    // It will be something like: 1678886400000-mypicture.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;