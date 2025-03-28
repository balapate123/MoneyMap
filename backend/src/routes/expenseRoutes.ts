import express from 'express';
import { createExpense, getExpenses, getSummary } from '../controllers/expenseController';
import { protect } from '../middleware/protect';


const router = express.Router();


router.post('/', protect, createExpense);
router.get('/', protect, getExpenses);
router.get('/summary', protect, getSummary);


// router.post('/', createExpense);
// router.get('/', getExpenses);
// router.get('/summary', getSummary);

export default router;
