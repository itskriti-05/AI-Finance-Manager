const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/requireAuth');
const { uploadStatement, listTransactions } = require('../controllers/transactionController');

router.post('/upload', requireAuth, upload.single('statement'), uploadStatement);
router.get('/', requireAuth, listTransactions);

module.exports = router;