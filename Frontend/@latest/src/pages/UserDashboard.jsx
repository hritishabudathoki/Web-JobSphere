import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobList from '../components/jobs/JobList';
import API from '../utils/api';
import './Dashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await API.getProfile();
        setUser(userResponse.data);
        
        const applicationsResponse = await API.getApplications();
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">
              <div className="logo-icon">🚀</div>
              <h2>JobSphere</h2>
            </div>
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-details">
                <h4>{user?.name || 'User'}</h4>
                <p>Job Seeker</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-btn">
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <span>🔍</span>
              Browse Jobs
            </button>
            <button
              className={`nav-tab ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <span>📋</span>
              My Applications
            </button>
            <button
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span>👤</span>
              Profile
            </button>
            <button
              className={`nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <span>❤️</span>
              Saved Jobs
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'jobs' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Available Jobs</h2>
              <div className="section-actions">
                <Link to="/jobs" className="btn-primary">
                  <span>🔍</span>
                  View All Jobs
                </Link>
              </div>
            </div>
            <JobList />
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">My Applications</h2>
            </div>
            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Applications Yet</h3>
                <p>Start applying to jobs to see your applications here.</p>
                <Link to="/jobs" className="btn-primary">
                  <span>🔍</span>
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.job?.title}</td>
                        <td>{application.job?.company}</td>
                        <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${application.status}`}>
                            {application.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-secondary">
                            <span>👁️</span>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">My Profile</h2>
              <div className="section-actions">
                <button className="btn-primary">
                  <span>✏️</span>
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={user?.phone || 'Not provided'} readOnly />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={user?.location || 'Not provided'} readOnly />
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <input type="text" value={user?.experience || 'Not specified'} readOnly />
              </div>
              <div className="form-group">
                <label>Skills</label>
                <textarea value={user?.skills || 'No skills listed'} readOnly />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Saved Jobs</h2>
            </div>
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <h3>No Saved Jobs</h3>
              <p>Jobs you save will appear here for easy access.</p>
              <Link to="/jobs" className="btn-primary">
                <span>🔍</span>
                Browse Jobs
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
