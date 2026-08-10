const fs = require("fs");
const csv = require("csv-parser");
const Transaction = require("../models/Transaction");
const { parseParticulars } = require("../utils/statementParser");
const { parsePdfBuffer } = require("../utils/pdfStatementParser");
const { categorizeTransaction } = require("../agents/categoryAgent");
const sendError = require("../utils/sendError");

function parseCsvFile(filePath) {
  return new Promise((resolve) => {
    const parsedRows = [];
    const failedRows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const parsed = parseParticulars(row);
          if (parsed) {
            parsedRows.push(parsed);
          } else {
            failedRows.push({
              row,
              reason: "Unrecognized transaction format (not a UPI transaction)",
            });
          }
        } catch (err) {
          failedRows.push({ row, reason: err.message });
        }
      })
      .on("end", () => resolve({ parsedRows, failedRows }));
  });
}

const uploadStatement = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  const isPdf = req.file.originalname.toLowerCase().endsWith(".pdf");

  try {
    let parsedRows = [];
    let failedRows = [];

    if (isPdf) {
      const buffer = fs.readFileSync(filePath);
      const pdfResult = await parsePdfBuffer(buffer);
      parsedRows = pdfResult.results;
      failedRows = pdfResult.errors;
    } else {
      const result = await parseCsvFile(filePath);
      parsedRows = result.parsedRows;
      failedRows = result.failedRows;
    }

    // Check for duplicates: same user, date, payee, and amount already exists
    const newRows = [];
    const duplicates = [];

    for (const row of parsedRows) {
      const existing = await Transaction.findOne({
        userId: req.userId,
        date: row.date,
        payee: row.payee,
        amount: row.amount,
      });

      if (existing) {
        duplicates.push(row);
      } else {
        newRows.push(row);
      }
    }

const categorized = await Promise.all(
      newRows.map(async (row) => {
        if (row.category) {
          return { ...row, userId: req.userId };
        }
        const { category, confidence } = await categorizeTransaction(row, req.userId);
        return { ...row, category, confidence, userId: req.userId };
      })
    );

    const inserted =
      categorized.length > 0 ? await Transaction.insertMany(categorized) : [];
    fs.unlinkSync(filePath);

    res.json({
      message: "Statement processed",
      fileType: isPdf ? "pdf" : "csv",
      count: inserted.length,
      duplicatesSkipped: duplicates.length,
      failedRows: failedRows.length,
      failedDetails: failedRows.slice(0, 5),
    });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    sendError(res, 500, "Failed to process statement", err);
  }
};
// GET /api/transactions?limit=10
const listTransactions = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(limit);
    res.json({ transactions });
  } catch (err) {
    sendError(res, 500, 'Failed to fetch transactions', err);
  }
};

module.exports = { uploadStatement, listTransactions };