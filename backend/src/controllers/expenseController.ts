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

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.user?.id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    console.log(expenses);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching expenses', error });
  }
};

export const getSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.user?.id;

    const expenses = await Expense.find({ userId });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategory: Record<string, number> = {};
    expenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    res.json({ total, byCategory });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching summary', error });
  }
};
