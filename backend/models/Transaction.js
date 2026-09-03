const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["DR", "CR"],
      required: true,
    },
    payee: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    confidence: {
      type: String,
      enum: ["high", "low", "none"],
      default: "none",
    },
    rawParticulars: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
