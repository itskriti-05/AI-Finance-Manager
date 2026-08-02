const fs = require('fs');
const csv = require('csv-parser');
const Transaction = require('../models/Transaction');
const { parseParticulars } = require('../utils/statementParser');

const uploadStatement = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const savedTransactions = [];
  const errors = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // "row" is one line of the CSV as a plain object, e.g.
      // { Date: '04-07-2026', Particulars: 'UPI/DR/.../BOAT/...', Deposits: '', Withdrawals: '984.00', Balance: '10393.66' }
      try {
        const parsed = parseParticulars(row);
        if (parsed) savedTransactions.push(parsed);
      } catch (err) {
        errors.push({ row, message: err.message });
      }
    })
    .on('end', async () => {
      try {
        const inserted = await Transaction.insertMany(savedTransactions);
        fs.unlinkSync(filePath); // clean up the temp file once we're done with it
        res.json({
          message: 'Statement processed',
          count: inserted.length,
          skipped: errors.length
        });
      } catch (err) {
        res.status(500).json({ error: 'Failed to save transactions', details: err.message });
      }
    });
};

module.exports = { uploadStatement };
