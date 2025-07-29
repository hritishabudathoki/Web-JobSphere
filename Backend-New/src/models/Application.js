import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'),
    defaultValue: 'pending',
    allowNull: false
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  interviewLocation: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'applications',
  indexes: [
    {
      fields: ['job_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['applied_at']
    },
    {
      unique: true,
      fields: ['job_id', 'user_id']
    }
  ]
});

export default Application; 