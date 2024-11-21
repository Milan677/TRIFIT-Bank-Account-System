const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  sender: { type: String, default: null }, 
  recipient: { type: String, default: null }, 
  date: { type: Date, default: Date.now },
});

const transactionModel =mongoose.model('Transaction', TransactionSchema);

module.exports={transactionModel}