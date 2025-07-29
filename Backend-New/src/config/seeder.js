import { User, Job, Application } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@jobsphere.com',
      password: adminPassword,
      role: 'admin',
      phone: '+977-9849876543',
      location: 'Kathmandu, Nepal',
      experience: '5+ years',
      skills: 'Management, HR, Recruitment'
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      phone: '+977-9841234567',
      location: 'Kathmandu, Nepal',
      experience: '2-4 years',
      skills: 'React, JavaScript, Node.js'
    });

    // Create sample jobs
    const jobs = await Job.bulkCreate([
      {
        title: 'Marketing Manager',
        company: 'Nepal Bank Limited',
        location: 'Kathmandu, Nepal',
        type: 'full-time',
        salary: '85000',
        experience: '3-5 years',
        description: 'We are looking for a Marketing Manager to lead our marketing initiatives and develop strategies to promote our banking services across Nepal.',
        requirements: 'Bachelor\'s degree in Marketing or related field, 3+ years of experience in marketing, Strong analytical and communication skills',
        benefits: 'Competitive salary, Health insurance, Professional development opportunities',
        status: 'active',
        postedBy: admin.id,
        tags: ['marketing', 'management', 'banking']
      },
      {
        title: 'Sales Representative',
        company: 'Ncell Axiata',
        location: 'Pokhara, Nepal',
        type: 'full-time',
        salary: '45000',
        experience: '1-3 years',
        description: 'Join our sales team to promote mobile services and expand our customer base in the Pokhara region.',
        requirements: 'High school diploma, 1+ years of sales experience, Excellent communication skills',
        benefits: 'Commission-based incentives, Mobile allowance, Training programs',
        status: 'active',
        postedBy: admin.id,
        tags: ['sales', 'telecommunications', 'customer-service']
      },
      {
        title: 'Accountant',
        company: 'Nepal Airlines',
        location: 'Kathmandu, Nepal',
        type: 'full-time',
        salary: '65000',
        experience: '2-4 years',
        description: 'We need a qualified accountant to manage financial records and ensure compliance with Nepalese accounting standards.',
        requirements: 'Bachelor\'s degree in Accounting, 2+ years of experience, Knowledge of Nepalese accounting standards',
        benefits: 'Competitive salary, Travel benefits, Professional certification support',
        status: 'active',
        postedBy: admin.id,
        tags: ['accounting', 'finance', 'aviation']
      },
      {
        title: 'Tour Guide',
        company: 'Everest Trekking',
        location: 'Lukla, Nepal',
        type: 'full-time',
        salary: '35000',
        experience: '1-2 years',
        description: 'Lead trekking groups to Everest Base Camp and other popular destinations in the Himalayas.',
        requirements: 'Tourism certification, 1+ years of guiding experience, Physical fitness, Knowledge of local culture',
        benefits: 'Travel opportunities, Tips and bonuses, Equipment provided',
        status: 'active',
        postedBy: admin.id,
        tags: ['tourism', 'outdoor', 'adventure']
      },
      {
        title: 'English Teacher',
        company: 'Nepal English School',
        location: 'Biratnagar, Nepal',
        type: 'full-time',
        salary: '40000',
        experience: '2-3 years',
        description: 'Teach English to students of various age groups and help improve their language skills.',
        requirements: 'Bachelor\'s degree in English or Education, 2+ years of teaching experience, TEFL certification preferred',
        benefits: 'Holiday benefits, Professional development, Small class sizes',
        status: 'active',
        postedBy: admin.id,
        tags: ['education', 'teaching', 'english']
      },
      {
        title: 'Software Developer',
        company: 'Tech Solutions Nepal',
        location: 'Remote',
        type: 'full-time',
        salary: '75000',
        experience: '3-5 years',
        description: 'Join our development team to build innovative software solutions for clients worldwide.',
        requirements: 'Bachelor\'s degree in Computer Science, 3+ years of experience in React/Node.js, Strong problem-solving skills',
        benefits: 'Remote work, Flexible hours, Health insurance, Learning budget',
        status: 'active',
        postedBy: admin.id,
        tags: ['software', 'development', 'remote']
      }
    ]);

    // Create sample applications
    await Application.bulkCreate([
      {
        jobId: jobs[0].id,
        userId: user.id,
        status: 'pending',
        coverLetter: 'I am excited to apply for the Marketing Manager position. With my experience in digital marketing and team leadership, I believe I can contribute significantly to your marketing initiatives.',
        appliedAt: new Date()
      },
      {
        jobId: jobs[2].id,
        userId: user.id,
        status: 'reviewed',
        coverLetter: 'I am interested in the Accountant position. My background in financial management and attention to detail make me a strong candidate for this role.',
        appliedAt: new Date(Date.now() - 86400000) // 1 day ago
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`👥 Created ${await User.count()} users`);
    console.log(`💼 Created ${await Job.count()} jobs`);
    console.log(`📝 Created ${await Application.count()} applications`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('./database.js').then(({ sequelize }) => {
    sequelize.sync({ force: true }).then(() => {
      seedDatabase().then(() => {
        console.log('🎉 Seeding completed!');
        process.exit(0);
      }).catch((error) => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
      });
    });
  });
} 