const { body, validationResult } = require('express-validator');

// Common validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// MongoDB ObjectId validation
const validateObjectId = (paramName = 'id') => {
  return body(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`);
};

// Common field validations
const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email');

const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

const nameValidation = body('name')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters');

// Pagination validation
const paginationValidation = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Component validation for designs
const componentValidation = [
  body('components.*.type')
    .isIn([
      'LIFE_SUPPORT', 'ECLSS', 'SLEEP_POD', 'SLEEP_QUARTERS', 'HYGIENE',
      'KITCHEN', 'FOOD_STORAGE', 'EXERCISE', 'TREADMILL', 'RESISTANCE_TRAINER',
      'LAB', 'WORKSTATION', 'STORAGE_RACK', 'CARGO_BAY', 'AIRLOCK',
      'EMERGENCY_KIT', 'MEDICAL_BAY', 'COMMUNICATION', 'MAINTENANCE'
    ])
    .withMessage('Invalid component type'),
  body('components.*.volume')
    .isFloat({ min: 0.1 })
    .withMessage('Component volume must be at least 0.1 cubic meters'),
  body('components.*.position')
    .isObject()
    .withMessage('Component position is required'),
  body('components.*.position.x')
    .isNumeric()
    .withMessage('Position X must be a number'),
  body('components.*.position.y')
    .isNumeric()
    .withMessage('Position Y must be a number'),
  body('components.*.position.z')
    .isNumeric()
    .withMessage('Position Z must be a number')
];

// Sanitization helpers
const sanitizeString = (str, maxLength = 100) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
};

const sanitizeNumber = (num, min = 0, max = Infinity) => {
  const parsed = parseFloat(num);
  if (isNaN(parsed)) return min;
  return Math.max(min, Math.min(max, parsed));
};

const sanitizeArray = (arr, maxLength = 10) => {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, maxLength).filter(Boolean);
};

module.exports = {
  handleValidationErrors,
  validateObjectId,
  emailValidation,
  passwordValidation,
  nameValidation,
  paginationValidation,
  componentValidation,
  sanitizeString,
  sanitizeNumber,
  sanitizeArray
};