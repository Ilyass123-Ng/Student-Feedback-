const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

const sampleCourses = [
  {
    title: 'Modern Web Development with React',
    description: 'Learn how to build scalable web applications using React 19 and Next.js 16.',
    category: 'Développement Web',
    instructor: 'Ilyas Ennajy'
  },
  {
    title: 'Cloud Native Architectures',
    description: 'Master Docker, Kubernetes, and microservices design patterns.',
    category: 'Cloud',
    instructor: 'Cloud Expert'
  },
  {
    title: 'DevOps Essentials',
    description: 'Continuous Integration and Deployment (CI/CD) pipelines from scratch.',
    category: 'DevOps',
    instructor: 'DevOps Pro'
  },
  {
    title: 'Introduction to Data Science',
    description: 'Explore data analysis, visualization, and machine learning basics.',
    category: 'Data Science',
    instructor: 'Data Scientist'
  },
  {
    title: 'Cybersecurity for Developers',
    description: 'Best practices for securing your web applications and APIs.',
    category: 'Sécurité',
    instructor: 'Security Analyst'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cours-db');
    console.log('--- Connected to MongoDB for seeding ---');
    
    await Course.deleteMany({}); // Clear existing data if any
    console.log('--- Existing courses cleared ---');
    
    await Course.insertMany(sampleCourses);
    console.log('--- Sample courses inserted successfully ---');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('!!! Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
