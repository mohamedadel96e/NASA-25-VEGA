const express = require('express');
const { body, query, param } = require('express-validator');

const {
  getDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
  validateDesignEndpoint,
  duplicateDesign,
  getPublicDesigns
} = require('../controllers/designController');

const { 
  protect, 
  authorize, 
  optionalAuth,
  requireEmailVerification 
} = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createDesignValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Design name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('habitat')
    .isObject()
    .withMessage('Habitat configuration is required'),
  body('habitat.shape')
    .isIn(['cylinder', 'sphere', 'dome'])
    .withMessage('Habitat shape must be cylinder, sphere, or dome'),
  body('habitat.dimensions')
    .isObject()
    .withMessage('Habitat dimensions are required'),
  body('crewSize')
    .isInt({ min: 1, max: 10 })
    .withMessage('Crew size must be between 1 and 10'),
  body('missionDuration')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Mission duration must be between 1 and 1000 days'),
  body('destination')
    .isIn(['LEO', 'Moon', 'Mars', 'Asteroid', 'Deep Space'])
    .withMessage('Destination must be LEO, Moon, Mars, Asteroid, or Deep Space'),
  body('components')
    .optional()
    .isArray()
    .withMessage('Components must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

const updateDesignValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Design name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('habitat')
    .optional()
    .isObject()
    .withMessage('Habitat configuration must be an object'),
  body('habitat.shape')
    .optional()
    .isIn(['cylinder', 'sphere', 'dome'])
    .withMessage('Habitat shape must be cylinder, sphere, or dome'),
  body('crewSize')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Crew size must be between 1 and 10'),
  body('missionDuration')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Mission duration must be between 1 and 1000 days'),
  body('destination')
    .optional()
    .isIn(['LEO', 'Moon', 'Mars', 'Asteroid', 'Deep Space'])
    .withMessage('Destination must be LEO, Moon, Mars, Asteroid, or Deep Space'),
  body('components')
    .optional()
    .isArray()
    .withMessage('Components must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

const listDesignsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),
  query('destination')
    .optional()
    .isIn(['LEO', 'Moon', 'Mars', 'Asteroid', 'Deep Space'])
    .withMessage('Destination must be LEO, Moon, Mars, Asteroid, or Deep Space'),
  query('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string')
];

const duplicateDesignValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Design name must be between 1 and 100 characters')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid design ID')
];

// Public routes (no authentication required)
router.get('/public', listDesignsValidation, getPublicDesigns);
router.get('/templates', listDesignsValidation, getPublicDesigns); // Alias for public designs

// Protected routes (authentication required)
router.use(protect);
router.use(requireEmailVerification);

// Design CRUD operations
router.get('/', listDesignsValidation, getDesigns);
router.post('/', createDesignValidation, createDesign);

router.get('/:id', idValidation, getDesign);
router.put('/:id', idValidation, updateDesignValidation, updateDesign);
router.delete('/:id', idValidation, deleteDesign);

// Design-specific operations
router.post('/:id/validate', idValidation, validateDesignEndpoint);
router.post('/:id/duplicate', idValidation, duplicateDesignValidation, duplicateDesign);

module.exports = router;