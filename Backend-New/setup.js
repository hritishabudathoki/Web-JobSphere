#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 JobSphere Backend Setup');
console.log('==========================\n');

// Check if config.env exists
const configPath = join(__dirname, 'config.env');
if (!existsSync(configPath)) {
  console.log('📝 Creating config.env file...');
  
  const defaultConfig = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobsphere_db
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=jobsphere-secret-key-2024
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
`;
  
  writeFileSync(configPath, defaultConfig);
  console.log('✅ config.env created with default values');
  console.log('⚠️  Please update the database credentials in config.env\n');
} else {
  console.log('✅ config.env already exists');
}

// Check if PostgreSQL is running
console.log('🔍 Checking PostgreSQL connection...');
try {
  execSync('pg_isready', { stdio: 'ignore' });
  console.log('✅ PostgreSQL is running');
} catch (error) {
  console.log('❌ PostgreSQL is not running or not installed');
  console.log('📋 Please install and start PostgreSQL:');
  console.log('   - macOS: brew install postgresql && brew services start postgresql');
  console.log('   - Ubuntu: sudo apt-get install postgresql postgresql-contrib');
  console.log('   - Windows: Download from https://www.postgresql.org/download/windows/');
  process.exit(1);
}

// Check if database exists
console.log('🔍 Checking database...');
try {
  execSync('psql -U postgres -d jobsphere_db -c "SELECT 1;"', { stdio: 'ignore' });
  console.log('✅ Database jobsphere_db exists');
} catch (error) {
  console.log('📝 Creating database jobsphere_db...');
  try {
    execSync('createdb -U postgres jobsphere_db', { stdio: 'ignore' });
    console.log('✅ Database created successfully');
  } catch (dbError) {
    console.log('❌ Failed to create database');
    console.log('📋 Please create the database manually:');
    console.log('   createdb -U postgres jobsphere_db');
    console.log('   Or using psql:');
    console.log('   psql -U postgres');
    console.log('   CREATE DATABASE jobsphere_db;');
    process.exit(1);
  }
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update database credentials in config.env if needed');
console.log('2. Run: npm run dev');
console.log('3. The API will be available at http://localhost:3000');
console.log('4. Test the health endpoint: http://localhost:3000/api/health');
console.log('\n🔑 Default login credentials:');
console.log('   Admin: admin@jobsphere.com / admin123');
console.log('   User:  john@example.com / user123'); 