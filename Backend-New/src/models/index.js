import User from './User.js';
import Job from './Job.js';
import Application from './Application.js';

// Define associations
User.hasMany(Job, { 
  foreignKey: 'postedBy', 
  as: 'postedJobs' 
});
Job.belongsTo(User, { 
  foreignKey: 'postedBy', 
  as: 'poster' 
});

User.hasMany(Application, { 
  foreignKey: 'userId', 
  as: 'applications' 
});
Application.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'applicant' 
});

Job.hasMany(Application, { 
  foreignKey: 'jobId', 
  as: 'applications' 
});
Application.belongsTo(Job, { 
  foreignKey: 'jobId', 
  as: 'job' 
});

// For application reviews
User.hasMany(Application, { 
  foreignKey: 'reviewedBy', 
  as: 'reviewedApplications' 
});
Application.belongsTo(User, { 
  foreignKey: 'reviewedBy', 
  as: 'reviewer' 
});

export { User, Job, Application }; 