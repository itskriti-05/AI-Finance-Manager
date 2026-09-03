const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");

const authLimiter = require("../middleware/authLimiter");
const requireAuth = require("../middleware/requireAuth");

router.post("/register", authLimiter, register);

router.post("/login", authLimiter, login);

router.get("/me", requireAuth, getCurrentUser);

module.exports = router;