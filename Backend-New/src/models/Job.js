import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
    defaultValue: 'full-time',
    allowNull: false
  },
  salary: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  experience: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 5000]
    }
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'closed'),
    defaultValue: 'active',
    allowNull: false
  },
  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'jobs',
  indexes: [
    {
      fields: ['title']
    },
    {
      fields: ['company']
    },
    {
      fields: ['location']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['posted_by']
    }
  ]
});

export default Job; 