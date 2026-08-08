const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { getBudget } = require('../controllers/budgetController');

router.get('/', requireAuth, getBudget);

module.exports = router;