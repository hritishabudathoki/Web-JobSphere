import express from 'express';
import { body, query } from 'express-validator';
import * as applicationController from '../controllers/applicationController.js';
import { authenticateToken, requireUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const applyForJobValidation = [
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter must be less than 2000 characters'),
  body('resume')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Resume URL must be less than 255 characters')
];

const updateApplicationValidation = [
  body('status')
    .isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'])
    .withMessage('Invalid application status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('interviewDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid interview date format'),
  body('interviewLocation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Interview location must be less than 200 characters')
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
  query('status')
    .optional()
    .isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'])
    .withMessage('Invalid status filter'),
  query('jobId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Job ID must be a positive integer')
];

// Protected routes
router.post('/jobs/:jobId/apply', authenticateToken, requireUser, applyForJobValidation, applicationController.applyForJob);
router.get('/user/applications', authenticateToken, requireUser, queryValidation, applicationController.getUserApplications);
router.get('/applications', authenticateToken, requireAdmin, queryValidation, applicationController.getAllApplications);
router.get('/applications/:id', authenticateToken, requireUser, applicationController.getApplication);
router.put('/applications/:id/status', authenticateToken, requireAdmin, updateApplicationValidation, applicationController.updateApplicationStatus);
router.delete('/applications/:id', authenticateToken, requireUser, applicationController.withdrawApplication);

export default router; 