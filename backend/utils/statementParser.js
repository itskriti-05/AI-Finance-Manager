function parseParticulars(row) {
  const particulars = row.Particulars || row.particulars || '';
  const parts = particulars.split('/');

  const type = parts[1];
  const payee = parts[3];

  if (!type || !payee) {
    return null;
  }

  const withdrawal = parseFloat((row.Withdrawals || '0').toString().replace(/,/g, ''));
  const deposit = parseFloat((row.Deposits || '0').toString().replace(/,/g, ''));
  const amount = type === 'DR' ? withdrawal : deposit;

  const balance = parseFloat((row.Balance || '0').toString().replace(/,/g, ''));

 return {
    date: new Date(row.Date), // ISO format (YYYY-MM-DD) parses correctly
    type,
    payee: payee.trim(),
    amount,
    balance,
    rawParticulars: particulars
  };

}

module.exports = { parseParticulars };
