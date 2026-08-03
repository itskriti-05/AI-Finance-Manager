const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/requireAuth');
const { uploadStatement } = require('../controllers/transactionController');

// POST /api/transactions/upload
// "statement" is the field name the frontend's form must use for the file
router.post('/upload', requireAuth, upload.single('statement'), uploadStatement);

module.exports = router;
