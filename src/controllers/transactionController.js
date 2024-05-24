import TransactionModel from '../models/transaction.js';

// getTransactionData
export const getTransactionData = async (req, res) => {
  try {
    const expensesData = await TransactionModel.find({ user: req.userId });

    if (!expensesData) {
      return res.status(404).json({ message: 'User expenses not found' });
    }

    res.json(expensesData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

// setTransaction
export const creteTransaction = async (req, res) => {
  const { amount, date, category } = req.body;
  console.log(req.body);

  try {
    const transaction = new TransactionModel({
      user: req.userId,
    });
    transaction.amount = amount;
    transaction.date = date;
    transaction.category = category;

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// editTransaction
export const editTransaction = async (req, res) => {
  const { _id, category, date, amount } = req.body;

  try {
    const userTransactions = await TransactionModel.find({
      user: req.userId,
    });

    if (!userTransactions) {
      return res.status(404).json({ message: 'there is no transaction found' });
    }

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(_id, {
      category,
      date,
      amount,
    });

    res.json(updatedTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// deleteTransaction
export const deleteTransaction = async (req, res) => {
  const { ids } = req.body;
  try {
    const userTransactions = await TransactionModel.find({
      user: req.userId,
    });

    if (!userTransactions) {
      return res.status(404).json({ message: 'there is no transaction found' });
    }

    const updatedTransactions = await TransactionModel.deleteMany({
      user: req.userId,
      _id: { $in: ids },
    });

    res.json(updatedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};