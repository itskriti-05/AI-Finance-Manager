const Transaction = require('../models/Transaction');
const { isEssential, isDiscretionary, isSavings } = require('../utils/spendingClassifier');

function moneyFlowVerdict(credited, debited) {
  const diff = credited - debited;
  if (diff > 0) {
    return { status: 'surplus', message: `You received ₹${diff.toFixed(2)} more than you spent.` };
  }
  if (diff < 0) {
    return { status: 'deficit', message: `You spent ₹${Math.abs(diff).toFixed(2)} more than you received.` };
  }
  return { status: 'break-even', message: 'What came in matched what went out exactly.' };
}

async function getWeeklyAnalysis(userId) {
  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const allDebits = await Transaction.find({
    userId, type: 'DR', date: { $gte: twoWeeksAgo, $lte: now }
  }).sort({ date: -1 });

  const savingsTxns = allDebits.filter(t => isSavings(t.category));
  const transactions = allDebits.filter(t => !isSavings(t.category));
  const totalMovedToSavings = savingsTxns.reduce((sum, t) => sum + t.amount, 0);

  const creditTransactions = await Transaction.find({
    userId, type: 'CR', date: { $gte: twoWeeksAgo, $lte: now }
  }).sort({ date: -1 });

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const creditedThisWeek = creditTransactions
    .filter(t => new Date(t.date) >= sevenDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  const creditedLastWeek = creditTransactions
    .filter(t => new Date(t.date) < sevenDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyDebits = await Transaction.find({
    userId, type: 'DR', date: { $gte: thirtyDaysAgo, $lte: now }
  });
  const monthlyCredits = await Transaction.find({
    userId, type: 'CR', date: { $gte: thirtyDaysAgo, $lte: now }
  });
  const monthlyDebited = monthlyDebits
    .filter(t => !isSavings(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyCredited = monthlyCredits.reduce((sum, t) => sum + t.amount, 0);

  const monthlyMoneyFlow = {
    days: 30,
    credited: monthlyCredited,
    debited: monthlyDebited,
    ...moneyFlowVerdict(monthlyCredited, monthlyDebited)
  };

  if (transactions.length === 0) {
    return {
      message: 'No expense data for the last 14 days',
      thisWeek: null, lastWeek: null, weekOverWeekChange: null,
      spendingLeaks: [], essentialVsDiscretionary: null, savingsSuggestions: [],
      movedToSavings: { total: totalMovedToSavings, transactionCount: savingsTxns.length },
      weeklyMoneyFlow: {
        thisWeek: { credited: creditedThisWeek, debited: 0, ...moneyFlowVerdict(creditedThisWeek, 0) },
        lastWeek: { credited: creditedLastWeek, debited: 0, ...moneyFlowVerdict(creditedLastWeek, 0) }
      },
      monthlyMoneyFlow
    };
  }

  const thisWeekTxns = transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
  const lastWeekTxns = transactions.filter(t => new Date(t.date) < sevenDaysAgo);

  const weekData = (txns) => {
    const total = txns.reduce((sum, t) => sum + t.amount, 0);
    const essential = txns.filter(t => isEssential(t.category)).reduce((sum, t) => sum + t.amount, 0);
    const discretionary = txns.filter(t => isDiscretionary(t.category)).reduce((sum, t) => sum + t.amount, 0);
    return { totalSpent: total, essentialSpent: essential, discretionarySpent: discretionary, transactionCount: txns.length };
  };

  const thisWeek = weekData(thisWeekTxns);
  const lastWeek = weekData(lastWeekTxns);

  const weekOverWeekChange = lastWeek.totalSpent > 0
    ? (((thisWeek.totalSpent - lastWeek.totalSpent) / lastWeek.totalSpent) * 100).toFixed(1)
    : null;

  const payeeFrequency = {};
  transactions.forEach(t => { payeeFrequency[t.payee] = (payeeFrequency[t.payee] || 0) + 1; });

  const spendingLeaks = Object.entries(payeeFrequency)
    .filter(([_, count]) => count >= 2)
    .map(([payee, count]) => {
      const txnsForPayee = transactions.filter(t => t.payee === payee);
      const totalForPayee = txnsForPayee.reduce((sum, t) => sum + t.amount, 0);
      return { payee, frequency: count, totalSpent: totalForPayee, avgPerTransaction: (totalForPayee / count).toFixed(2) };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const essentialVsDiscretionary = {
    essential: {
      amount: thisWeek.essentialSpent,
      percentage: thisWeek.totalSpent > 0 ? ((thisWeek.essentialSpent / thisWeek.totalSpent) * 100).toFixed(1) : 0
    },
    discretionary: {
      amount: thisWeek.discretionarySpent,
      percentage: thisWeek.totalSpent > 0 ? ((thisWeek.discretionarySpent / thisWeek.totalSpent) * 100).toFixed(1) : 0
    }
  };

  const categorySpending = {};
  thisWeekTxns.filter(t => isDiscretionary(t.category)).forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
  });

  const savingsSuggestions = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => {
      const suggestedCut = (amount * 0.2).toFixed(2);
      return { category, currentSpend: amount, suggestedReduction: suggestedCut, potentialSavings: suggestedCut };
    });

  const daysElapsed = Math.min(7, thisWeekTxns.length > 0 ? 7 : 0);
  const projectedMonthlySpend = daysElapsed > 0 ? (thisWeek.totalSpent * (30 / daysElapsed)).toFixed(2) : 0;

  return {
    thisWeek, lastWeek, weekOverWeekChange, projectedMonthlySpend,
    essentialVsDiscretionary, spendingLeaks, savingsSuggestions,
    movedToSavings: { total: totalMovedToSavings, transactionCount: savingsTxns.length },
    weeklyMoneyFlow: {
      thisWeek: { credited: creditedThisWeek, debited: thisWeek.totalSpent, ...moneyFlowVerdict(creditedThisWeek, thisWeek.totalSpent) },
      lastWeek: { credited: creditedLastWeek, debited: lastWeek.totalSpent, ...moneyFlowVerdict(creditedLastWeek, lastWeek.totalSpent) }
    },
    monthlyMoneyFlow
  };
}



module.exports = { getWeeklyAnalysis };