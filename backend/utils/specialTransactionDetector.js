const SPECIAL_PATTERNS = [
  { regex: /RD\s*DRAWDOWN|RD\s*INSTALLMENT|RECURRING\s*DEPOSIT/i, payee: 'RD Deposit', category: 'Savings' },
  { regex: /FD\s*DRAWDOWN|FIXED\s*DEPOSIT/i, payee: 'FD Deposit', category: 'Savings' }
];

function detectSpecialTransaction(narrativeText) {
  for (const pattern of SPECIAL_PATTERNS) {
    if (pattern.regex.test(narrativeText)) {
      return { payee: pattern.payee, category: pattern.category };
    }
  }
  return null;
}

module.exports = { detectSpecialTransaction };