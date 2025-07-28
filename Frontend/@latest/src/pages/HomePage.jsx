import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">🚀</div>
            <h2>JobSphere</h2>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/jobs" className="nav-link">Jobs</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link signup-btn">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div>
            <h1>Discover Your Dream Career</h1>
            <p>Connect with top employers worldwide and find opportunities that match your passion and expertise. Join thousands of professionals who found their perfect role through JobSphere.</p>
            <div className="hero-buttons">
              <Link to="/jobs" className="btn btn-primary">
                <span>🔍</span>
                Explore Jobs
              </Link>
              <Link to="/register" className="btn btn-secondary">
                <span>💼</span>
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <span>💼</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose JobSphere?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Matching</h3>
              <p>Our AI-powered algorithm matches you with the perfect job opportunities based on your skills, experience, and career goals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick Apply</h3>
              <p>Apply to multiple jobs with just one click. Save time and focus on what matters most - your career growth.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your application status in real-time and get instant updates on your job applications and interviews.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Top Companies</h3>
              <p>Connect with leading companies and startups from around the world, all looking for talented professionals like you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>15,000+</h3>
              <p>Active Jobs</p>
            </div>
            <div className="stat-item">
              <h3>8,000+</h3>
              <p>Companies</p>
            </div>
            <div className="stat-item">
              <h3>75,000+</h3>
              <p>Job Seekers</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of professionals who found their dream jobs through JobSphere. Start your journey today!</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              <span>🚀</span>
              Get Started
            </Link>
            <Link to="/jobs" className="btn btn-outline">
              <span>🔍</span>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>JobSphere</h3>
              <p>Connecting talent with opportunity worldwide</p>
            </div>
            <div className="footer-section">
              <h4>For Job Seekers</h4>
              <ul>
                <li><Link to="/jobs">Browse Jobs</Link></li>
                <li><Link to="/register">Create Account</Link></li>
                <li><Link to="/user">My Profile</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>For Employers</h4>
              <ul>
                <li><Link to="/register">Post a Job</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 JobSphere. All rights reserved. Made with ❤️ for job seekers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 