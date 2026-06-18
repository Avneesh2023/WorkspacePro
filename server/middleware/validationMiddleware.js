const { body, validationResult } = require('express-validator');

// Reusable helper to process validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

const registerValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate,
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const clientValidationRules = [
  body('name').trim().notEmpty().withMessage('Client name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^\+?[\d\s\-()]{7,20}$/)
    .withMessage('Invalid phone number format'),
  validate,
];

const projectValidationRules = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('deadline')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid deadline date format'),
  validate,
];

const taskValidationRules = [
  body('title')
    .if((value, { req }) => req.method === 'POST' || 'title' in req.body)
    .trim()
    .notEmpty()
    .withMessage('Task title is required'),
  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid due date format'),
  validate,
];


module.exports = {
  registerValidationRules,
  loginValidationRules,
  clientValidationRules,
  projectValidationRules,
  taskValidationRules,
};
