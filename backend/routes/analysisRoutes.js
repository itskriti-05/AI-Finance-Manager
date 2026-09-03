const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { getAnalysis } = require('../controllers/analysisController');

router.get('/weekly', requireAuth, getAnalysis);

module.exports = router;