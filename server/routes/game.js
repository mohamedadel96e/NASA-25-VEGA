const express = require('express');
const { body, query } = require('express-validator');

const {
  getGameProgress,
  startLevel,
  completeLevel,
  updateProgress,
  getAllLevelsInfo,
  validateDesign
} = require('../controllers/gameController');

const { 
  protect, 
  requireEmailVerification 
} = require('../middleware/auth');

const router = express.Router();

// Validation rules
const startLevelValidation = [
  body('level')
    .isInt({ min: 1, max: 10 })
    .withMessage('Level must be between 1 and 10')
];

const completeLevelValidation = [
  body('level')
    .isInt({ min: 1, max: 10 })
    .withMessage('Level must be between 1 and 10'),
  body('score')
    .isInt({ min: 0, max: 1000 })
    .withMessage('Score must be between 0 and 1000'),
  body('stars')
    .isInt({ min: 0, max: 3 })
    .withMessage('Stars must be between 0 and 3'),
  body('timeTaken')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time taken must be a positive number'),
  body('design')
    .optional()
    .isObject()
    .withMessage('Design must be an object')
];

const updateProgressValidation = [
  body('currentDesign')
    .optional()
    .isObject()
    .withMessage('Current design must be an object'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object')
];

const leaderboardValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('type')
    .optional()
    .isIn(['total', 'level'])
    .withMessage('Type must be either total or level'),
  query('level')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Level must be between 1 and 10')
];

// All game routes require authentication and email verification
router.use(protect);
router.use(requireEmailVerification);

// Game progress routes
router.get('/progress', getGameProgress);
router.put('/progress', updateProgressValidation, updateProgress);

// Level management routes
router.post('/level/start', startLevelValidation, startLevel);
router.post('/level/complete', completeLevelValidation, completeLevel);

// Essential game routes only - no TODO endpoints

router.get('/levels', protect, requireEmailVerification, getAllLevelsInfo);

const validateDesignValidation = [
  body('components')
    .isArray({ min: 1 })
    .withMessage('Components array is required'),
  body('habitatShape')
    .notEmpty()
    .withMessage('Habitat shape is required'),
  body('crewSize')
    .isInt({ min: 1, max: 10 })
    .withMessage('Crew size must be between 1 and 10'),
  body('level')
    .isInt({ min: 1, max: 10 })
    .withMessage('Level must be between 1 and 10')
];

router.post('/validate-design', 
  protect, 
  requireEmailVerification, 
  validateDesignValidation, 
  validateDesign
);

module.exports = router;