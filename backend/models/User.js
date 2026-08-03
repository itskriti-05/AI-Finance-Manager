const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
    // never stored as plain text - see the pre-save hook below
    // select: false means .find()/.findOne() never returns this field
    // unless explicitly requested with .select('+password')
  }
}, { timestamps: true });

// Runs automatically right before a user document is saved.
// Only hashes the password if it's new or was just changed -
// otherwise every unrelated update (like renaming) would re-hash
// an already-hashed password and break login.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check a login attempt's password against the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);