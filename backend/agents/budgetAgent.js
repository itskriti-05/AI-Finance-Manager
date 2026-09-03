const Transaction = require('../models/Transaction');
const { isEssential, isDiscretionary, isSavings } = require('../utils/spendingClassifier');

async function generateBudget(userId, monthlyIncome) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const allDebits = await Transaction.find({
    userId, type: 'DR', date: { $gte: thirtyDaysAgo, $lte: now }
  });

  const savingsTxns = allDebits.filter(t => isSavings(t.category));
  const transactions = allDebits.filter(t => !isSavings(t.category));
  const totalMovedToSavings = savingsTxns.reduce((sum, t) => sum + t.amount, 0);

  if (transactions.length === 0) {
    return {
      message: 'No spending data for the last 30 days - upload a statement first',
      categoryBudgets: [], totalSuggestedBudget: 0, predictedSavings: null,
      existingSavings: { total: totalMovedToSavings, transactionCount: savingsTxns.length }
    };
  }

  const categoryTotals = {};
  transactions.forEach(t => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount; });

  const categoryBudgets = Object.entries(categoryTotals).map(([category, spent]) => {
    let suggestedBudget;
    if (isEssential(category)) suggestedBudget = spent;
    else if (isDiscretionary(category)) suggestedBudget = Math.round(spent * 0.85);
    else suggestedBudget = spent;

    return { category, last30DaySpend: spent, suggestedMonthlyBudget: suggestedBudget, type: isEssential(category) ? 'essential' : 'discretionary' };
  }).sort((a, b) => b.last30DaySpend - a.last30DaySpend);

  const totalSuggestedBudget = categoryBudgets.reduce((sum, c) => sum + c.suggestedMonthlyBudget, 0);
  const totalActualSpend = categoryBudgets.reduce((sum, c) => sum + c.last30DaySpend, 0);

  let predictedSavings = null;
  if (monthlyIncome && monthlyIncome > 0) {
    predictedSavings = {
      income: monthlyIncome, suggestedBudget: totalSuggestedBudget,
      predictedSavingsIfFollowed: monthlyIncome - totalSuggestedBudget,
      currentSavingsPace: monthlyIncome - totalActualSpend
    };
  }

  return {
    categoryBudgets, totalActualSpend, totalSuggestedBudget,
    potentialMonthlySavings: totalActualSpend - totalSuggestedBudget,
    predictedSavings,
    existingSavings: {
      total: totalMovedToSavings,
      transactionCount: savingsTxns.length,
      
      message: totalMovedToSavings > 0
        ? `You're already setting aside ₹${totalMovedToSavings} via RD/FD this month - keep it up!`
        : null
    }
  };
}

module.exports = { generateBudget };