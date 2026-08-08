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

//accept CSV files and pdf files both
const fileFilter = (req, file, cb) => {
  const isCsv = file.mimetype === 'text/csv' || file.originalname.endsWith('.csv');
  const isPdf = file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf');

  if (isCsv || isPdf) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV or PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
