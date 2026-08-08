const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendError = require('../utils/sendError');
const { validateRegisterInput, validateLoginInput, sanitizeInput } = require('../utils/validation');

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const register = async (req, res) => {
  const { isValid, errors } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json({ errors });

  const name = sanitizeInput(req.body.name);
  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ errors: { email: 'An account with this email already exists' } });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    sendError(res, 500, 'Registration failed', err);
  }
};

const login = async (req, res) => {
  const { isValid, errors } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json({ errors });

  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    sendError(res, 500, 'Login failed', err);
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    sendError(res, 500, "Failed to fetch user", err);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};