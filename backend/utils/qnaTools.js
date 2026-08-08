const Transaction = require('../models/Transaction');

async function getSpendByCategory(userId, category, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const transactions = await Transaction.find({
    userId, type: 'DR', category, date: { $gte: since }
  });
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return { category, days, totalSpent: total, transactionCount: transactions.length };
}

async function getSpendByPayee(userId, payee, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const transactions = await Transaction.find({
    userId, type: 'DR',
    payee: { $regex: payee, $options: 'i' },
    date: { $gte: since }
  });
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return { payee, days, totalSpent: total, transactionCount: transactions.length };
}

async function getTopCategories(userId, days = 30, limit = 3) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const transactions = await Transaction.find({ userId, type: 'DR', date: { $gte: since } });
  const totals = {};
  transactions.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, total]) => ({ category, total }));
  return { days, topCategories: sorted };
}

async function getTotalSpend(userId, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const transactions = await Transaction.find({ userId, type: 'DR', date: { $gte: since } });
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return { days, totalSpent: total, transactionCount: transactions.length };
}

const toolDeclarations = [
  {
    name: 'getSpendByCategory',
    description: 'Get total spending in a specific category (e.g. Food, Shopping, Bills) over a number of days',
    parameters: {
      type: 'OBJECT',
      properties: {
        category: { type: 'STRING', description: 'The spending category to look up' },
        days: { type: 'NUMBER', description: 'How many days back to look, default 30' }
      },
      required: ['category']
    }
  },
  {
    name: 'getSpendByPayee',
    description: 'Get total spending sent to a specific payee/merchant name over a number of days',
    parameters: {
      type: 'OBJECT',
      properties: {
        payee: { type: 'STRING', description: 'The merchant or payee name' },
        days: { type: 'NUMBER', description: 'How many days back to look, default 30' }
      },
      required: ['payee']
    }
  },
  {
    name: 'getTopCategories',
    description: 'Get the top spending categories ranked by amount, over a number of days',
    parameters: {
      type: 'OBJECT',
      properties: {
        days: { type: 'NUMBER', description: 'How many days back to look, default 30' },
        limit: { type: 'NUMBER', description: 'How many top categories to return, default 3' }
      }
    }
  },
  {
    name: 'getTotalSpend',
    description: 'Get total overall spending across all categories over a number of days',
    parameters: {
      type: 'OBJECT',
      properties: {
        days: { type: 'NUMBER', description: 'How many days back to look, default 30' }
      }
    }
  }
];

const toolFunctions = {
  getSpendByCategory,
  getSpendByPayee,
  getTopCategories,
  getTotalSpend
};

module.exports = { toolDeclarations, toolFunctions };