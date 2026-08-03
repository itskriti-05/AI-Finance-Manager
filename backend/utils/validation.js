const validator = require('validator');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

function validateRegisterInput({ name, email, password }) {
  const errors = {};
  if (!name || validator.isEmpty(name.trim())) errors.name = 'Name is required';
  if (!email || !validator.isEmail(email)) errors.email = 'Enter a valid email address';
  if (!password || !PASSWORD_REGEX.test(password)) {
    errors.password = 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateLoginInput({ email, password }) {
  const errors = {};
  if (!email || !validator.isEmail(email)) errors.email = 'Enter a valid email address';
  if (!password || validator.isEmpty(password)) errors.password = 'Password is required';
  return { isValid: Object.keys(errors).length === 0, errors };
}

function sanitizeInput(str) {
  return validator.escape(validator.trim(str));
}

module.exports = { validateRegisterInput, validateLoginInput, sanitizeInput };