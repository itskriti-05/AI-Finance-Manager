const { generateBudget } = require('../agents/budgetAgent');
const sendError = require('../utils/sendError');

const getBudget = async (req, res) => {
  try {
    const monthlyIncome = req.query.income ? parseFloat(req.query.income) : null;
    const budget = await generateBudget(req.userId, monthlyIncome);
    res.json(budget);
  } catch (err) {
    sendError(res, 500, 'Failed to generate budget', err);
  }
};

module.exports = { getBudget };