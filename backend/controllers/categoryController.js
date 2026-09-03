const Transaction = require('../models/Transaction');
const Rule = require('../models/Rule');
const sendError = require('../utils/sendError');

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category, saveAsRule } = req.body;

  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const transaction = await Transaction.findOne({ _id: id, userId: req.userId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.category = category;
    transaction.confidence = 'high';
    await transaction.save();

    if (saveAsRule) {
      await Rule.findOneAndUpdate(
        { userId: req.userId, payee: transaction.payee },
        { userId: req.userId, payee: transaction.payee, category },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Category updated', transaction });
  } catch (err) {
    sendError(res, 500, 'Failed to update category', err);
  }
};

module.exports = { updateCategory };