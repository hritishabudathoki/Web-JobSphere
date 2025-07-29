import { Application, Job, User } from '../models/index.js';
import { validationResult } from 'express-validator';

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { jobId } = req.params;
    const { coverLetter, resume } = req.body;

    // Check if job exists and is active
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      where: { jobId, userId: req.user.id }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      userId: req.user.id,
      coverLetter,
      resume
    });

    const applicationWithDetails = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: applicationWithDetails
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
};

// Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location', 'type', 'salary']
        }
      ],
      order: [['appliedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

// Get all applications (admin only)
export const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (jobId) {
      whereClause.jobId = jobId;
    }

    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['appliedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

// Update application status (admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, notes, interviewDate, interviewLocation } = req.body;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.update({
      status,
      notes,
      interviewDate,
      interviewLocation,
      reviewedAt: new Date(),
      reviewedBy: req.user.id
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
};

// Get single application
export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location', 'type', 'salary', 'description']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email', 'phone', 'location', 'experience', 'skills']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to view this application
    if (application.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
};

// Withdraw application
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant
    if (application.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    if (application.status !== 'pending' && application.status !== 'reviewed') {
      return res.status(400).json({
        success: false,
        message: 'Application cannot be withdrawn at this stage'
      });
    }

    await application.destroy();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw application'
    });
  }
}; 