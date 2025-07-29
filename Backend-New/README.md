# 🚀 JobSphere Backend - Express.js + Sequelize + PostgreSQL

A robust backend API for the JobSphere job portal built with Express.js, Sequelize ORM, and PostgreSQL database.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan

## 📋 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (User/Admin)
- Password hashing with bcryptjs
- Profile management

### 💼 Job Management
- CRUD operations for job postings
- Advanced search and filtering
- Pagination support
- Job status management
- Tag-based categorization

### 📝 Application System
- Job application submission
- Application status tracking
- Admin application review
- Interview scheduling
- Application withdrawal

### 🔒 Security Features
- Input validation and sanitization
- SQL injection prevention
- XSS protection with helmet
- CORS configuration
- Rate limiting ready

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd Backend-New
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb jobsphere_db
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE jobsphere_db;
   ```

4. **Configure environment variables**
   ```bash
   # Copy and edit the config file
   cp config.env.example config.env
   ```
   
   Update the database credentials in `config.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=jobsphere_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job (authenticated)
- `PUT /api/jobs/:id` - Update job (authenticated)
- `DELETE /api/jobs/:id` - Delete job (authenticated)
- `GET /api/jobs/user/jobs` - Get user's posted jobs

### Applications
- `POST /api/applications/jobs/:jobId/apply` - Apply for job
- `GET /api/applications/user/applications` - Get user's applications
- `GET /api/applications` - Get all applications (admin)
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id/status` - Update application status (admin)
- `DELETE /api/applications/:id` - Withdraw application

### Health Check
- `GET /api/health` - API health status

## 🗄️ Database Schema

### Users Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `role` (ENUM: 'user', 'admin')
- `phone` (VARCHAR)
- `location` (VARCHAR)
- `experience` (VARCHAR)
- `skills` (TEXT)
- `avatar` (VARCHAR)
- `isActive` (BOOLEAN)
- `createdAt`, `updatedAt` (Timestamps)

### Jobs Table
- `id` (Primary Key)
- `title` (VARCHAR)
- `company` (VARCHAR)
- `location` (VARCHAR)
- `type` (ENUM: 'full-time', 'part-time', 'contract', 'internship', 'remote')
- `salary` (VARCHAR)
- `experience` (VARCHAR)
- `description` (TEXT)
- `requirements` (TEXT)
- `benefits` (TEXT)
- `status` (ENUM: 'active', 'inactive', 'closed')
- `postedBy` (Foreign Key to Users)
- `applicationDeadline` (DATE)
- `tags` (ARRAY)
- `createdAt`, `updatedAt` (Timestamps)

### Applications Table
- `id` (Primary Key)
- `jobId` (Foreign Key to Jobs)
- `userId` (Foreign Key to Users)
- `status` (ENUM: 'pending', 'reviewed', 'shortlisted', 'rejected', 'accepted')
- `coverLetter` (TEXT)
- `resume` (VARCHAR)
- `appliedAt` (DATE)
- `reviewedAt` (DATE)
- `reviewedBy` (Foreign Key to Users)
- `notes` (TEXT)
- `interviewDate` (DATE)
- `interviewLocation` (VARCHAR)
- `createdAt`, `updatedAt` (Timestamps)

## 🔧 Scripts

```bash
# Development
npm run dev          # Start with nodemon

# Production
npm start            # Start server

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:reset     # Reset database
```

## 🔒 Security Features

- **Input Validation**: All inputs validated with express-validator
- **Password Security**: bcryptjs for password hashing
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for frontend origin
- **Helmet**: Security headers
- **SQL Injection Prevention**: Sequelize ORM protection
- **XSS Protection**: Input sanitization

## 🧪 Testing

The API can be tested using tools like:
- Postman
- Insomnia
- curl commands
- Frontend application

## 📝 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobsphere_db
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**JobSphere Backend** - Built with ❤️ for job seekers and employers worldwide. 