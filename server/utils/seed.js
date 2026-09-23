/**
 * Optional seed script.
 * Creates a default admin and demo user with a few sample tasks.
 * Run with: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@taskflow.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Demo User',
    email: 'demo@taskflow.com',
    password: 'demo123',
    role: 'user',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing users & tasks');

    const createdUsers = await User.create(sampleUsers);
    const demoUser = createdUsers.find((u) => u.role === 'user');
    const adminUser = createdUsers.find((u) => u.role === 'admin');

    const sampleTasks = [
      {
        title: 'Build Login Page',
        description: 'Create a responsive login page with validation.',
        category: 'Development',
        priority: 'high',
        status: 'completed',
        dueDate: new Date(Date.now() + 3 * 86400000),
        userId: demoUser._id,
        assignedBy: adminUser._id,
      },
      {
        title: 'Design Dashboard Mockup',
        description: 'Create a Figma mockup for the new dashboard.',
        category: 'Design',
        priority: 'medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 5 * 86400000),
        userId: demoUser._id,
        assignedBy: adminUser._id,
      },
      {
        title: 'Write API Documentation',
        description: 'Document all REST endpoints with examples.',
        category: 'Documentation',
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 86400000),
        userId: demoUser._id,
        assignedBy: adminUser._id,
      },
    ];

    await Task.create(sampleTasks);

    console.log('Seed complete!');
    console.log('----------------------------------');
    console.log('Admin login: admin@taskflow.com / admin123');
    console.log('User login:  demo@taskflow.com / demo123');
    console.log('----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seed();