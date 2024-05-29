import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: Number,
  description: String,
  category: {
    type: String,
    enum: ['expense', 'income', 'transfer', 'others'],
    default: 'expense',
  },
  date: { type: Date, default: Date.now },
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

export default TransactionModel;
