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

export const validateSignupRequest = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First Name is required')
    .if(body('firstName').notEmpty())
    .matches(/^[a-zA-Z]+$/)
    .withMessage('Your Name must contain only letters')
    .isLength({ min: 2, max: 20 })
    .withMessage('Your Name must be at least 2 characters long')
    .escape(),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last Name is required')
    .if(body('lastName').notEmpty())
    .matches(/^[a-zA-Z]+$/)
    .withMessage('Your Name must contain only letters')
    .isLength({ min: 2, max: 20 })
    .withMessage('Your Name must be at least 2 characters long')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-Mail address is required')
    .if(body('email').notEmpty())
    .isEmail()
    .withMessage('Email address is not valid')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .if(body('password').notEmpty())
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .isLength({ min: 8, max: 40 })
    .withMessage('Password must be at least 8 characters long'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .if(body('email').notEmpty())
    .isEmail()
    .withMessage('Email address is not valid')
    .normalizeEmail(),

  body('password').trim().notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];
