// Turns one raw CSV row into a clean object matching the Transaction schema.
// Assumes a Particulars string shaped like:
// UPI/DR/655159610941/BOAT/AIRP/**TWLQR@MAIRTEL/UPI//GKM8TLXOUIEUMVII9MHPUDYO4LWEP3F6QUN/04/07/2026 15:48:54

function parseParticulars(row) {
  const particulars = row.Particulars || row.particulars || '';
  const parts = particulars.split('/');

  // parts[0] = "UPI", parts[1] = "DR" or "CR", parts[3] = payee name
  const type = parts[1];
  const payee = parts[3];

  if (!type || !payee) {
    // Doesn't match the expected UPI format - skip for now,
    // we can add handling for NEFT/IMPS/ATM formats later
    return null;
  }

  const withdrawal = parseFloat((row.Withdrawals || '0').toString().replace(/,/g, ''));
  const deposit = parseFloat((row.Deposits || '0').toString().replace(/,/g, ''));
  const amount = type === 'DR' ? withdrawal : deposit;

  const balance = parseFloat((row.Balance || '0').toString().replace(/,/g, ''));

  return {
    date: new Date(row.Date),
    type,
    payee: payee.trim(),
    amount,
    balance,
    rawParticulars: particulars
  };
}

module.exports = { parseParticulars };
