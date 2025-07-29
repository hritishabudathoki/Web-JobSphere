import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import './JobList.css';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    coverLetter: '',
    resume: null
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await API.getJobs();
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    // Pre-fill form with user data if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setApplicationForm({
      candidateName: user.name || '',
      candidateEmail: user.email || '',
      candidatePhone: user.phone || '',
      coverLetter: '',
      resume: null
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      const applicationData = {
        coverLetter: applicationForm.coverLetter,
        resume: applicationForm.resume
      };

      await API.applyForJob(selectedJob.id, applicationData);
      
      // Reset form and close modal
      setApplicationForm({
        candidateName: '',
        candidateEmail: '',
        candidatePhone: '',
        coverLetter: '',
        resume: null
      });
      setShowApplicationModal(false);
      setSelectedJob(null);
      
      alert('Application submitted successfully! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setApplicationForm(prev => ({
      ...prev,
      resume: file
    }));
  };

  const closeModal = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
    setApplicationForm({
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      coverLetter: '',
      resume: null
    });
  };

  if (loading) {
    return (
      <div className="job-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-list-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h2>Available Jobs</h2>
        <p>{jobs.length} jobs found</p>
      </div>
      
      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs available at the moment.</p>
          <p>Check back later for new opportunities!</p>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-type">{job.type}</span>
              </div>
              
              <div className="job-company">
                <span className="company-name">{job.company}</span>
                <span className="job-location">📍 {job.location}</span>
              </div>
              
              <p className="job-description">
                {job.description.length > 150 
                  ? `${job.description.substring(0, 150)}...` 
                  : job.description
                }
              </p>
              
              <div className="job-details">
                <span className="job-salary">💰 NPR {job.salary}</span>
                <span className="job-experience">📋 {job.experience}</span>
              </div>
              
              <div className="job-actions">
                <button 
                  className="btn-apply"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                </button>
                <button className="btn-view">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {selectedJob.title}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="application-form">
              <div className="form-group">
                <label>👤 Full Name *</label>
                <input
                  type="text"
                  name="candidateName"
                  value={applicationForm.candidateName}
                  onChange={handleFormChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>📧 Email Address *</label>
                <input
                  type="email"
                  name="candidateEmail"
                  value={applicationForm.candidateEmail}
                  onChange={handleFormChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>📞 Phone Number</label>
                <input
                  type="tel"
                  name="candidatePhone"
                  value={applicationForm.candidatePhone}
                  onChange={handleFormChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <label>📄 Cover Letter *</label>
                <textarea
                  name="coverLetter"
                  value={applicationForm.coverLetter}
                  onChange={handleFormChange}
                  placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                  rows="6"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>📎 Resume/CV (Optional)</label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
