import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'jobsphere-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
let users = [
  {
    id: 1,
    _id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    phone: '+977-9841234567',
    location: 'Kathmandu, Nepal',
    experience: '2-4 years',
    skills: 'React, JavaScript, Node.js'
  },
  {
    id: 2,
    _id: 2,
    name: 'Admin User',
    email: 'admin@jobsphere.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    phone: '+977-9849876543',
    location: 'Kathmandu, Nepal',
    experience: '5+ years',
    skills: 'Management, HR, Recruitment'
  }
];

let jobs = [
  {
    _id: 1,
    title: 'Marketing Manager',
    company: 'Nepal Bank Limited',
    location: 'Kathmandu, Nepal',
    salary: '85000',
    type: 'full-time',
    experience: '3-5 years',
    description: 'We are looking for a Marketing Manager to lead our marketing initiatives and develop strategies to promote our banking services across Nepal.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  },
  {
    _id: 2,
    title: 'Sales Representative',
    company: 'Ncell Axiata',
    location: 'Pokhara, Nepal',
    salary: '45000',
    type: 'full-time',
    experience: '1-3 years',
    description: 'Join our sales team to promote mobile services and expand our customer base in the Pokhara region.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  },
  {
    _id: 3,
    title: 'Accountant',
    company: 'Nepal Airlines',
    location: 'Kathmandu, Nepal',
    salary: '65000',
    type: 'full-time',
    experience: '2-4 years',
    description: 'We need a qualified accountant to manage financial records and ensure compliance with Nepalese accounting standards.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  },
  {
    _id: 4,
    title: 'Tour Guide',
    company: 'Everest Trekking',
    location: 'Lukla, Nepal',
    salary: '35000',
    type: 'full-time',
    experience: '1-2 years',
    description: 'Lead trekking groups to Everest Base Camp and other popular destinations in the Himalayas.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  },
  {
    _id: 5,
    title: 'English Teacher',
    company: 'Nepal English School',
    location: 'Biratnagar, Nepal',
    salary: '40000',
    type: 'full-time',
    experience: '2-3 years',
    description: 'Teach English to students of various age groups and help improve their language skills.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  },
  {
    _id: 6,
    title: 'Restaurant Manager',
    company: 'Thamel Restaurant',
    location: 'Kathmandu, Nepal',
    salary: '55000',
    type: 'full-time',
    experience: '3-5 years',
    description: 'Manage daily operations of our popular restaurant in Thamel, including staff supervision and customer service.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  },
  {
    _id: 7,
    title: 'Hotel Receptionist',
    company: 'Annapurna Hotel',
    location: 'Pokhara, Nepal',
    salary: '30000',
    type: 'full-time',
    experience: '1-2 years',
    description: 'Provide excellent customer service to hotel guests and manage front desk operations.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  },
  {
    _id: 8,
    title: 'Delivery Driver',
    company: 'Foodmandu',
    location: 'Kathmandu, Nepal',
    salary: '25000',
    type: 'full-time',
    experience: '0-1 years',
    description: 'Deliver food orders to customers across Kathmandu Valley using our delivery platform.',
    status: 'active',
    createdAt: '2025-07-27T08:09:57.499Z'
  }
];

let applications = [
  {
    _id: 1,
    jobId: 1,
    jobTitle: 'Marketing Manager',
    candidateName: 'John Doe',
    candidateEmail: 'john@example.com',
    candidatePhone: '+977-9841234567',
    coverLetter: 'I am excited to apply for the Marketing Manager position at Nepal Bank Limited. With my experience in marketing and passion for the banking sector, I believe I can contribute significantly to your team.',
    status: 'pending',
    createdAt: new Date()
  },
  {
    _id: 2,
    jobId: 2,
    jobTitle: 'Sales Representative',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane@example.com',
    candidatePhone: '+977-9849876543',
    coverLetter: 'I am interested in the Sales Representative role at Ncell Axiata. My background in customer service and sales makes me a perfect fit for this position.',
    status: 'reviewing',
    createdAt: new Date()
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'JobSphere API is running!' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, company } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      _id: users.length + 1,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      company,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Job routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs.filter(job => job.status === 'active'));
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j._id == req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json(job);
});

app.post('/api/jobs', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const newJob = {
    _id: jobs.length + 1,
    ...req.body,
    status: 'active',
    createdAt: new Date()
  };

  jobs.push(newJob);
  res.status(201).json(newJob);
});

app.put('/api/jobs/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const jobIndex = jobs.findIndex(j => j._id == req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({ message: 'Job not found' });
  }

  jobs[jobIndex] = { ...jobs[jobIndex], ...req.body };
  res.json(jobs[jobIndex]);
});

app.delete('/api/jobs/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const jobIndex = jobs.findIndex(j => j._id == req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({ message: 'Job not found' });
  }

  jobs.splice(jobIndex, 1);
  res.json({ message: 'Job deleted successfully' });
});

// Application routes
app.get('/api/applications', authenticateToken, (req, res) => {
  let userApplications = applications;
  
  if (req.user.role === 'user') {
    // For users, show their own applications
    userApplications = applications.filter(app => app.candidateEmail === req.user.email);
  }

  // Populate job data
  const populatedApplications = userApplications.map(app => ({
    ...app,
    job: jobs.find(j => j._id === app.jobId)
  }));

  res.json(populatedApplications);
});

app.post('/api/applications', authenticateToken, (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'User access required' });
  }

  const { jobId, jobTitle, candidateName, candidateEmail, candidatePhone, coverLetter } = req.body;
  
  // Check if job exists
  const job = jobs.find(j => j._id == jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Check if already applied
  const existingApplication = applications.find(
    app => app.jobId == jobId && app.candidateEmail === candidateEmail
  );
  if (existingApplication) {
    return res.status(400).json({ message: 'Already applied to this job' });
  }

  const newApplication = {
    _id: applications.length + 1,
    jobId,
    jobTitle,
    candidateName,
    candidateEmail,
    candidatePhone,
    coverLetter,
    status: 'pending',
    createdAt: new Date()
  };

  applications.push(newApplication);
  res.status(201).json(newApplication);
});

app.put('/api/applications/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const applicationIndex = applications.findIndex(app => app._id == req.params.id);
  if (applicationIndex === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  applications[applicationIndex] = { ...applications[applicationIndex], ...req.body };
  res.json(applications[applicationIndex]);
});

app.delete('/api/applications/:id', authenticateToken, (req, res) => {
  const applicationIndex = applications.findIndex(app => app._id == req.params.id);
  if (applicationIndex === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  // Check if user owns the application or is admin
  if (req.user.role !== 'admin' && applications[applicationIndex].userId !== req.user.userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  applications.splice(applicationIndex, 1);
  res.json({ message: 'Application deleted successfully' });
});

// User routes
app.get('/api/users/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/api/users/profile', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;

  const { password, ...userWithoutPassword } = updatedUser;
  res.json(userWithoutPassword);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 JobSphere Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
}); 