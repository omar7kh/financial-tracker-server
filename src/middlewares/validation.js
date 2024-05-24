import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateTransactionRequest = [
  body('amount').notEmpty().withMessage('Amount is required'),
  body('category').isString().notEmpty().withMessage('Category is required'),
  body('date').isString().notEmpty().withMessage('Date is required'),
  handleValidationErrors,
];
