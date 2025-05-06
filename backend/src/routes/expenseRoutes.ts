import express from 'express';
import {
  createExpense,
  getExpenses,
  getSummary,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController';

import { protect } from '../middleware/protect';


const router = express.Router();

// Create a new expense
router.post('/', protect, createExpense);

// Get all expenses
router.get('/', protect, getExpenses);

// Get expense summary
router.get('/summary', protect, getSummary);

// Update a specific expense
router.put('/:id', protect, updateExpense);

// Delete a specific expense
router.delete('/:id', protect, deleteExpense);

export default router;
