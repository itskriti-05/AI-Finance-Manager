const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { askQuestion } = require('../controllers/qnaController');

router.post('/', requireAuth, askQuestion);

module.exports = router;