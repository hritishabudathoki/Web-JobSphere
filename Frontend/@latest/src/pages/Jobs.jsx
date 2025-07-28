import React, { useState } from 'react';
import JobList from '../components/jobs/JobList';
import './Jobs.css';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  return (
    <div className="jobs-page">
      {/* Header */}
      <div className="jobs-header">
        <div className="jobs-header-content">
          <h1>Find Your Dream Job</h1>
          <p>Discover opportunities that match your skills and aspirations</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Job Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <select
            className="filter-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="remote">Remote</option>
            <option value="san-francisco">San Francisco, CA</option>
            <option value="new-york">New York, NY</option>
            <option value="austin">Austin, TX</option>
            <option value="seattle">Seattle, WA</option>
          </select>
        </div>
      </div>
      
      {/* Job List */}
      <div className="jobs-content">
        <div className="container">
          <JobList />
        </div>
      </div>
    </div>
  );
};

export default Jobs; 