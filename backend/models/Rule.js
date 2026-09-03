const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payee: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

// A user can only have one rule per payee - but different users can
// each have their own rule for the same payee name that will help them change categories 
ruleSchema.index({ userId: 1, payee: 1 }, { unique: true });

module.exports = mongoose.model('Rule', ruleSchema);