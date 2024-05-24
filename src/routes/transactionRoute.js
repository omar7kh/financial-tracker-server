import express from 'express';
import {
  getTransactionData,
  creteTransaction,
  editTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { jwtCheck } from '../middlewares/isAuth.js';
import { validateTransactionRequest } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', jwtCheck, getTransactionData);
router.post('/', jwtCheck, validateTransactionRequest, creteTransaction);
router.put('/', jwtCheck, editTransaction);
router.delete('/', jwtCheck, deleteTransaction);

export default router;
