const fs = require('fs');
const csv = require('csv-parser');
const sendError = require('../utils/sendError');
const Transaction = require('../models/Transaction');
const { parseParticulars } = require('../utils/statementParser');
const { categorizeTransaction } = require('../agents/categoryAgent');

const uploadStatement = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const parsedRows = [];
  const errors = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      try {
        const parsed = parseParticulars(row);
        if (parsed) parsedRows.push(parsed);
      } catch (err) {
        errors.push({ row, message: err.message });
      }
    })
    .on('end', async () => {
      try {
        // Categorize each row before saving - this is the Category agent step
       const categorized = await Promise.all(
  parsedRows.map(async (row) => {
    const { category, confidence } = await categorizeTransaction(row, req.userId);
    return { ...row, category, confidence, userId: req.userId };
  })
);

        const inserted = await Transaction.insertMany(categorized);
        fs.unlinkSync(filePath);
        res.json({
          message: 'Statement processed',
          count: inserted.length,
          skipped: errors.length
        });
      } catch (err) {
        sendError(res, 500, 'Failed to save transactions', err);
      }
    });
};

module.exports = { uploadStatement };