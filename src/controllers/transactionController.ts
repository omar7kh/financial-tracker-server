import { Request, Response } from 'express';
import TransactionModel from '../models/transaction';

// GET TRANSACTION DATA
export const getTransactionData = async (req: Request, res: Response) => {
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

// CREATE TRANSACTION
export const creteTransaction = async (req: Request, res: Response) => {
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

// EDIT TRANSACTION
export const editTransaction = async (req: Request, res: Response) => {
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

// DELETE TRANSACTION
export const deleteTransaction = async (req: Request, res: Response) => {
  const { ids } = req.body;
  console.log(ids);

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
