const express = require('express');
const { body } = require('express-validator');

const {
  register,
  login,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  refreshToken,
  logout
} = require('../controllers/authController');

const { 
  protect, 
  authorize, 
  refreshToken: refreshTokenMiddleware 
} = require('../middleware/auth');

const { 
  authLimiter, 
  passwordResetLimiter, 
  otpLimiter 
} = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules Using express-validator (I know that Joi is more powerful but this is simpler for now)
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['student', 'professional'])
    .withMessage('Role must be either student or professional')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const otpValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number')
];

const resetPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters'),
  body('institution')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Institution cannot exceed 100 characters'),
  body('profession')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Profession cannot exceed 100 characters'),
  body('role')
    .optional()
    .isIn(['student', 'professional'])
    .withMessage('Role must be either student or professional')
];

// Public routes
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/verify-email', authLimiter, otpValidation, verifyEmail);
router.post('/resend-otp', otpLimiter, emailValidation, resendOTP);
router.post('/forgot-password', passwordResetLimiter, emailValidation, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidation, resetPassword);
router.post('/refresh-token', refreshTokenMiddleware, refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, updateProfile);
router.post('/logout', protect, logout);


module.exports = router;