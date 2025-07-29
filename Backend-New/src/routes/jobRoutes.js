import express from 'express';
import { body, query } from 'express-validator';
import * as jobController from '../controllers/jobController.js';
import { authenticateToken, requireUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const createJobValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Job title must be between 3 and 200 characters'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('salary')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Salary must be less than 50 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Experience must be less than 50 characters'),
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Requirements must be less than 2000 characters'),
  body('benefits')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Benefits must be less than 2000 characters'),
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateJobValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Job title must be between 3 and 200 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  body('type')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'closed'])
    .withMessage('Invalid status'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isIn(['all', 'full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type filter'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'closed'])
    .withMessage('Invalid status filter'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'title', 'company', 'location', 'salary'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC')
];

// Public routes
router.get('/', queryValidation, jobController.getJobs);
router.get('/:id', jobController.getJob);

// Protected routes
router.post('/', authenticateToken, requireUser, createJobValidation, jobController.createJob);
router.put('/:id', authenticateToken, requireUser, updateJobValidation, jobController.updateJob);
router.delete('/:id', authenticateToken, requireUser, jobController.deleteJob);
router.get('/user/jobs', authenticateToken, requireUser, jobController.getUserJobs);

export default router; 