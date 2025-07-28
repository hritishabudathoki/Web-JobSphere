# 🚀 JobSphere - Complete Job Portal

A modern, full-stack job portal built with React and Express.js, featuring user authentication, job management, and application tracking.

## ✨ Features

### 🏠 **Homepage**
- Modern landing page with hero section
- Feature highlights and statistics
- Call-to-action sections
- Professional footer

### 🔐 **Authentication System**
- **Login/Register** - Modern forms with validation
- **Role-based access** - Job seekers vs Employers
- **JWT authentication** - Secure token-based auth
- **Form validation** - Real-time error handling

### 👤 **User Dashboard**
- **Browse Jobs** - Search and filter job listings
- **My Applications** - Track application status
- **Profile Management** - Edit personal information
- **Saved Jobs** - Bookmark interesting positions

### 👨‍💼 **Admin Dashboard**
- **Overview** - Statistics and recent activity
- **Manage Jobs** - Create, edit, delete job postings
- **Applications** - Review and manage applications
- **Post Jobs** - Comprehensive job creation form

### 💼 **Job Management**
- **Job Listings** - Beautiful card-based display
- **Search & Filter** - Find jobs by type, location
- **Application System** - Apply to jobs with one click
- **Status Tracking** - Monitor application progress

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients

### Backend
- **Express.js** - RESTful API server
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobSphere-App
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd Frontend/@latest
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd Backend/@latest
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   cd Backend/@latest
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

5. **Start the Frontend Development Server**
   ```bash
   cd Frontend/@latest
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📱 Usage

### Demo Accounts

**Job Seeker:**
- Email: `john@example.com`
- Password: `password`

**Admin/Employer:**
- Email: `admin@jobsphere.com`
- Password: `password`

### Getting Started

1. **Visit the homepage** - `http://localhost:5173`
2. **Register a new account** or **Login** with demo credentials
3. **Browse jobs** on the jobs page
4. **Apply to jobs** as a job seeker
5. **Manage applications** as an employer

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (admin only)
- `PUT /api/jobs/:id` - Update job (admin only)
- `DELETE /api/jobs/:id` - Delete job (admin only)

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Apply to job
- `PUT /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Delete application

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 Design Features

- **Modern UI/UX** - Clean, professional design
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Hover effects and transitions
- **Gradient Backgrounds** - Beautiful color schemes
- **Card-based Layout** - Modern component design

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **CORS Protection** - Cross-origin security
- **Input Validation** - Form validation and sanitization
- **Role-based Access** - User and admin permissions

## 📁 Project Structure

```
JobSphere-App/
├── Frontend/@latest/
│   ├── src/
│   │   ├── components/
│   │   │   └── jobs/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
├── Backend/@latest/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure both servers are running
3. Verify the API endpoints are accessible
4. Check the browser's network tab for failed requests

---

**JobSphere** - Connecting talent with opportunity! 🎯 