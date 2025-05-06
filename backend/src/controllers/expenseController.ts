/// <reference path="../types/express/index.d.ts" />

import { Request, Response } from 'express';
import Expense from '../models/Expense';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, category, note, date } = req.body;
    const userId = req.user?.id; // Use your auth logic here

    const expense = await Expense.create({
      userId,
      amount,
      category,
      note,
      date,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ msg: 'Error creating expense', error });
  }
};

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ msg: 'Unauthorized' });
      return;
    }

    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching expenses', error });
  }
};


export const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    console.log('🔍 userId:', userId);

    const rawExpenses = await Expense.find({ userId: userId.toString() });
    console.log('📦 Raw expenses for user:', rawExpenses.length);

    const matchStage = {
      userId: userId.toString(),
    };
    
    const categoryTotals = await Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);
    
    const dailyTotals = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    

    console.log('📊 categoryTotals:', categoryTotals);
    console.log('📈 dailyTotals:', dailyTotals);

    const categoryResult = categoryTotals.reduce((acc, item) => {
      acc[item._id] = item.total;
      return acc;
    }, {} as Record<string, number>);

    const dailyResult = dailyTotals.map((item) => ({
      date: item._id,
      total: item.total,
    }));

    res.json({
      categoryTotals: categoryResult,
      dailyTotals: dailyResult,
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ msg: 'Error fetching summary', error });
  }
};


export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      res.status(404).json({ msg: 'Expense not found' });
      return;
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ msg: 'Error updating expense', error });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!deletedExpense) {
      res.status(404).json({ msg: 'Expense not found' });
      return;
    }

    res.json({ msg: 'Expense deleted', deletedExpense });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting expense', error });
  }
};
