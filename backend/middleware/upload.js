const multer = require('multer');
const path = require('path');

// Store uploaded files temporarily in an "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Prefix with timestamp so two uploads never overwrite each other
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Only accept CSV files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
