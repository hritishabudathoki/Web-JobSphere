import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [postingJob, setPostingJob] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    experience: '',
    description: ''
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userResponse = await API.getProfile();
        setUser(userResponse.data);
        
        const jobsResponse = await API.getJobs();
        setJobs(jobsResponse.data);
        
        const applicationsResponse = await API.getAllApplications();
        setApplications(applicationsResponse.data);
        
        // Calculate stats
        const activeJobs = jobsResponse.data.filter(job => job.status === 'active').length;
        const pendingApplications = applicationsResponse.data.filter(app => app.status === 'pending').length;
        
        setStats({
          totalJobs: jobsResponse.data.length,
          activeJobs,
          totalApplications: applicationsResponse.data.length,
          pendingApplications
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleJobStatusChange = async (jobId, newStatus) => {
    try {
      await API.updateJob(jobId, { status: newStatus });
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      
      // Update stats
      const activeJobs = jobs.filter(job => 
        job.id === jobId ? newStatus === 'active' : job.status === 'active'
      ).length;
      setStats(prev => ({ ...prev, activeJobs }));
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const handleApplicationStatusChange = async (applicationId, newStatus) => {
    try {
      await API.updateApplication(applicationId, { status: newStatus });
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // Update stats
      const pendingApplications = applications.filter(app => 
        app.id === applicationId ? newStatus !== 'pending' : app.status === 'pending'
      ).length;
      setStats(prev => ({ ...prev, pendingApplications }));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const handleViewCandidateDetails = (application) => {
    setSelectedCandidate(application);
    setShowCandidateModal(true);
  };

  const handleContactCandidate = (application) => {
    const { applicant } = application;
    const emailSubject = encodeURIComponent(`Regarding your application for ${application.job?.title}`);
    const emailBody = encodeURIComponent(`Dear ${applicant?.name},\n\nThank you for your interest in the ${application.job?.title} position at ${application.job?.company}.\n\nWe would like to discuss your application further.\n\nBest regards,\n${user?.name || 'Hiring Team'}`);
    
    window.open(`mailto:${applicant?.email}?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  const closeCandidateModal = () => {
    setShowCandidateModal(false);
    setSelectedCandidate(null);
  };

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    
    try {
      const response = await API.createJob(jobForm);
      setJobs(prev => [response.data, ...prev]);
      
      // Reset form
      setJobForm({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        salary: '',
        experience: '',
        description: ''
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalJobs: prev.totalJobs + 1,
        activeJobs: prev.activeJobs + 1
      }));
      
      // Switch to jobs tab
      setActiveTab('jobs');
      alert('Job posted successfully!');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setPostingJob(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }
    
    try {
      await API.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      
      // Update stats
      const deletedJob = jobs.find(job => job.id === jobId);
      const wasActive = deletedJob?.status === 'active';
      setStats(prev => ({
        ...prev,
        totalJobs: prev.totalJobs - 1,
        activeJobs: wasActive ? prev.activeJobs - 1 : prev.activeJobs
      }));
      
      alert('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'closed': return 'status-closed';
      case 'pending': return 'status-pending';
      case 'reviewing': return 'status-reviewing';
      case 'shortlisted': return 'status-shortlisted';
      case 'rejected': return 'status-rejected';
      case 'hired': return 'status-hired';
      default: return 'status-default';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading admin dashboard...</p>
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
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="user-details">
                <h4>{user?.name || 'Admin'}</h4>
                <p>Employer</p>
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
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span>📊</span>
              Overview
            </button>
            <button
              className={`nav-tab ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <span>💼</span>
              Job Management
            </button>
            <button
              className={`nav-tab ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <span>📋</span>
              Applications
            </button>
            <button
              className={`nav-tab ${activeTab === 'post-job' ? 'active' : ''}`}
              onClick={() => setActiveTab('post-job')}
            >
              <span>➕</span>
              Post Job
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="overview-grid">
              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-value">{stats.totalJobs}</div>
                <div className="stat-label">Total Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{stats.activeJobs}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{stats.totalApplications}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{stats.pendingApplications}</div>
                <div className="stat-label">Pending Reviews</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Details</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map((app, index) => (
                      <tr key={app.id || index}>
                        <td>New Application</td>
                                                    <td>{app.applicant?.name || 'Anonymous'} - {app.job?.title}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan="4" className="empty-table">
                          No recent activity
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Quick Actions</h2>
              </div>
              <div className="quick-actions">
                <button 
                  className="quick-action-btn"
                  onClick={() => setActiveTab('post-job')}
                >
                  <span>➕</span>
                  Post New Job
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => setActiveTab('applications')}
                >
                  <span>📋</span>
                  Review Applications
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => setActiveTab('jobs')}
                >
                  <span>💼</span>
                  Manage Jobs
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'jobs' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Job Management</h2>
              <div className="section-actions">
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('post-job')}
                >
                  <span>➕</span>
                  Post New Job
                </button>
              </div>
            </div>
            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💼</div>
                <h3>No Jobs Posted Yet</h3>
                <p>Start by posting your first job to attract talented candidates.</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('post-job')}
                >
                  <span>➕</span>
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Applications</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <div className="job-title-cell">
                            <strong>{job.title}</strong>
                            <small>{job.type} • {job.experience}</small>
                          </div>
                        </td>
                        <td>{job.company}</td>
                        <td>{job.location}</td>
                        <td>
                          <span className="application-count">
                            {applications.filter(app => app.jobId === job.id).length}
                          </span>
                        </td>
                        <td>
                          <select
                            value={job.status}
                            onChange={(e) => handleJobStatusChange(job.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-secondary">
                              <span>👁️</span>
                              View
                            </button>
                            <button 
                              className="btn-danger"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <span>🗑️</span>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Application Management</h2>
            </div>
            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Applications Yet</h3>
                <p>Applications will appear here once candidates start applying to your jobs.</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('post-job')}
                >
                  <span>➕</span>
                  Post a Job to Get Applications
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Job Title</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id}>
                        <td>
                          <div className="candidate-cell">
                            <div className="candidate-avatar">
                              {(application.applicant?.name || 'A').charAt(0)}
                            </div>
                            <div>
                              <strong>{application.applicant?.name || 'Anonymous'}</strong>
                              <small>{application.applicant?.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{application.job?.title}</td>
                        <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            value={application.status}
                            onChange={(e) => handleApplicationStatusChange(application.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-secondary"
                              onClick={() => handleViewCandidateDetails(application)}
                            >
                              <span>👁️</span>
                              View Details
                            </button>
                            <button 
                              className="btn-primary"
                              onClick={() => handleContactCandidate(application)}
                            >
                              <span>📧</span>
                              Contact
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'post-job' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Post New Job</h2>
            </div>
            <form onSubmit={handlePostJob} className="form-grid">
              <div className="form-group">
                <label>🎯 Job Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={jobForm.title}
                  onChange={handleJobFormChange}
                  placeholder="e.g., Senior React Developer" 
                  required
                />
              </div>
              <div className="form-group">
                <label>🏢 Company *</label>
                <input 
                  type="text" 
                  name="company"
                  value={jobForm.company}
                  onChange={handleJobFormChange}
                  placeholder="Your company name" 
                  required
                />
              </div>
              <div className="form-group">
                <label>📍 Location *</label>
                <input 
                  type="text" 
                  name="location"
                  value={jobForm.location}
                  onChange={handleJobFormChange}
                  placeholder="e.g., Kathmandu, Nepal or Remote" 
                  required
                />
              </div>
              <div className="form-group">
                <label>⏰ Job Type *</label>
                <select 
                  name="type"
                  value={jobForm.type}
                  onChange={handleJobFormChange}
                  required
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label>💰 Salary Range *</label>
                <input 
                  type="text" 
                  name="salary"
                  value={jobForm.salary}
                  onChange={handleJobFormChange}
                  placeholder="e.g., NPR 50,000 - 80,000" 
                  required
                />
              </div>
              <div className="form-group">
                <label>📈 Experience Level *</label>
                <input 
                  type="text" 
                  name="experience"
                  value={jobForm.experience}
                  onChange={handleJobFormChange}
                  placeholder="e.g., 3-5 years" 
                  required
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>📝 Job Description *</label>
                <textarea 
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobFormChange}
                  placeholder="Describe the role, responsibilities, requirements, and benefits..."
                  rows="8"
                  required
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={postingJob}
                >
                  <span>{postingJob ? '⏳' : '📤'}</span>
                  {postingJob ? 'Posting Job...' : 'Post Job'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setActiveTab('jobs')}
                  style={{ marginLeft: '15px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Candidate Details Modal */}
        {showCandidateModal && selectedCandidate && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Candidate Details</h2>
                <button onClick={closeCandidateModal} className="close-btn">×</button>
              </div>
              <div className="modal-body">
                <div className="candidate-info">
                  <div className="candidate-header">
                    <div className="candidate-avatar large">
                      {(selectedCandidate.applicant?.name || 'A').charAt(0)}
                    </div>
                    <div>
                      <h3>{selectedCandidate.applicant?.name || 'Anonymous'}</h3>
                      <p className="candidate-email">{selectedCandidate.applicant?.email}</p>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h4>📞 Contact Information</h4>
                    <p><strong>Email:</strong> {selectedCandidate.applicant?.email}</p>
                    <p><strong>Phone:</strong> {selectedCandidate.applicant?.phone || 'Not provided'}</p>
                  </div>

                  <div className="info-section">
                    <h4>💼 Application Details</h4>
                    <p><strong>Position:</strong> {selectedCandidate.job?.title}</p>
                    <p><strong>Company:</strong> {selectedCandidate.job?.company}</p>
                    <p><strong>Applied:</strong> {new Date(selectedCandidate.appliedAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span className={`status-badge ${getStatusBadgeClass(selectedCandidate.status)}`}>
                      {selectedCandidate.status}
                    </span></p>
                  </div>

                  {selectedCandidate.coverLetter && (
                    <div className="info-section">
                      <h4>📝 Cover Letter</h4>
                      <div className="cover-letter">
                        {selectedCandidate.coverLetter}
                      </div>
                    </div>
                  )}

                  {selectedCandidate.notes && (
                    <div className="info-section">
                      <h4>📋 Notes</h4>
                      <p>{selectedCandidate.notes}</p>
                    </div>
                  )}

                  {selectedCandidate.interviewDate && (
                    <div className="info-section">
                      <h4>📅 Interview Details</h4>
                      <p><strong>Date:</strong> {new Date(selectedCandidate.interviewDate).toLocaleDateString()}</p>
                      {selectedCandidate.interviewLocation && (
                        <p><strong>Location:</strong> {selectedCandidate.interviewLocation}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-primary"
                  onClick={() => handleContactCandidate(selectedCandidate)}
                >
                  <span>📧</span>
                  Contact Candidate
                </button>
                <button 
                  className="btn-secondary"
                  onClick={closeCandidateModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
