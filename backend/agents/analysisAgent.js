const Transaction = require('../models/Transaction');
const { isEssential, isDiscretionary } = require('../utils/spendingClassifier');

async function getWeeklyAnalysis(userId) {
  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const transactions = await Transaction.find({
    userId,
    type: 'DR',
    date: { $gte: twoWeeksAgo, $lte: now }
  }).sort({ date: -1 });

  if (transactions.length === 0) {
    return {
      message: 'No expense data for the last 14 days',
      thisWeek: null,
      lastWeek: null,
      weekOverWeekChange: null,
      spendingLeaks: [],
      essentialVsDiscretionary: null,
      savingsSuggestions: []
    };
  }

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekTxns = transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
  const lastWeekTxns = transactions.filter(t => new Date(t.date) < sevenDaysAgo);

  const weekData = (txns) => {
    const total = txns.reduce((sum, t) => sum + t.amount, 0);
    const essential = txns
      .filter(t => isEssential(t.category))
      .reduce((sum, t) => sum + t.amount, 0);
    const discretionary = txns
      .filter(t => isDiscretionary(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalSpent: total,
      essentialSpent: essential,
      discretionarySpent: discretionary,
      transactionCount: txns.length
    };
  };

  const thisWeek = weekData(thisWeekTxns);
  const lastWeek = weekData(lastWeekTxns);

  const weekOverWeekChange = lastWeek.totalSpent > 0
    ? (((thisWeek.totalSpent - lastWeek.totalSpent) / lastWeek.totalSpent) * 100).toFixed(1)
    : null;

  const payeeFrequency = {};
  transactions.forEach(t => {
    payeeFrequency[t.payee] = (payeeFrequency[t.payee] || 0) + 1;
  });

  const spendingLeaks = Object.entries(payeeFrequency)
    .filter(([_, count]) => count >= 2)
    .map(([payee, count]) => {
      const txnsForPayee = transactions.filter(t => t.payee === payee);
      const totalForPayee = txnsForPayee.reduce((sum, t) => sum + t.amount, 0);
      const avgAmount = (totalForPayee / count).toFixed(2);
      return { payee, frequency: count, totalSpent: totalForPayee, avgPerTransaction: avgAmount };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const essentialVsDiscretionary = {
    essential: {
      amount: thisWeek.essentialSpent,
      percentage: thisWeek.totalSpent > 0
        ? ((thisWeek.essentialSpent / thisWeek.totalSpent) * 100).toFixed(1)
        : 0
    },
    discretionary: {
      amount: thisWeek.discretionarySpent,
      percentage: thisWeek.totalSpent > 0
        ? ((thisWeek.discretionarySpent / thisWeek.totalSpent) * 100).toFixed(1)
        : 0
    }
  };

  const categorySpending = {};
  thisWeekTxns
    .filter(t => isDiscretionary(t.category))
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

  const savingsSuggestions = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => {
      const suggestedCut = (amount * 0.2).toFixed(2);
      return {
        category,
        currentSpend: amount,
        suggestedReduction: suggestedCut,
        potentialSavings: suggestedCut
      };
    });

  const daysElapsed = Math.min(7, thisWeekTxns.length > 0 ? 7 : 0);
  const projectedMonthlySpend = daysElapsed > 0
    ? (thisWeek.totalSpent * (30 / daysElapsed)).toFixed(2)
    : 0;

  return {
    thisWeek,
    lastWeek,
    weekOverWeekChange,
    projectedMonthlySpend,
    essentialVsDiscretionary,
    spendingLeaks,
    savingsSuggestions
  };
}

module.exports = { getWeeklyAnalysis };