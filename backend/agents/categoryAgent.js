const Rule = require('../models/Rule');
const knownMerchants = require('../utils/knownMerchants');
const { categorizeWithLLM } = require('../utils/llmClient');

async function categorizeTransaction(transaction, userId) {
  const payee = transaction.payee.toUpperCase();

  const rule = await Rule.findOne({ userId, payee });
  if (rule) {
    return { category: rule.category, confidence: 'high' };
  }

  if (knownMerchants[payee]) {
    return { category: knownMerchants[payee], confidence: 'high' };
  }

  const guess = await categorizeWithLLM(transaction.payee);
  return { category: guess, confidence: 'low' };
}

module.exports = { categorizeTransaction };