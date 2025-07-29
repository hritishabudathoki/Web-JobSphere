import { Job, User, Application } from '../models/index.js';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

// Get all jobs with filters
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      location,
      status = 'active',
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { status };

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Add type filter
    if (type && type !== 'all') {
      whereClause.type = type;
    }

    // Add location filter
    if (location && location !== 'all') {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
};

// Get single job by ID
export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job'
    });
  }
};

// Create new job
export const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      company,
      location,
      type,
      salary,
      experience,
      description,
      requirements,
      benefits,
      applicationDeadline,
      tags
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      salary,
      experience,
      description,
      requirements,
      benefits,
      applicationDeadline,
      tags,
      postedBy: req.user.id
    });

    const jobWithPoster = await Job.findByPk(job.id, {
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: jobWithPoster
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job'
    });
  }
};

// Update job
export const updateJob = async (req, res) => {
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
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the job poster or admin
    if (job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    await job.update(req.body);

    const updatedJob = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job'
    });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the job poster or admin
    if (job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.destroy();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job'
    });
  }
};

// Get jobs by user (posted by user)
export const getUserJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: { postedBy: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user jobs'
    });
  }
}; 