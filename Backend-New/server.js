import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import database and models
import { sequelize, testConnection } from './src/config/database.js';
import './src/models/index.js';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import applicationRoutes from './src/routes/applicationRoutes.js';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'JobSphere API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message
      }))
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
      field: error.errors[0].path
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 JobSphere Backend Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer(); 