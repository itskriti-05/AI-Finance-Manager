const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { updateCategory } = require('../controllers/categoryController');

// PATCH /api/categories/:id
router.patch('/:id', requireAuth, updateCategory);

module.exports = router;