/**
 * Seed script for demo data.
 * Creates an admin, a few users, and a rich set of sample tasks so dashboards and charts look populated.
 * Run with: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const daysFromNow = (d) => new Date(Date.now() + d * 86400000);

const sampleUsers = [
  { name: 'Admin User', email: 'admin@taskflow.com', password: 'admin123', role: 'admin' },
  { name: 'Demo User', email: 'demo@taskflow.com', password: 'demo123', role: 'user' },
  { name: 'Sara Chen', email: 'sara@taskflow.com', password: 'sara123', role: 'user' },
  { name: 'Mike Torres', email: 'mike@taskflow.com', password: 'mike123', role: 'user' },
];

const taskTitles = {
  Development: [
    'Build Login Page', 'Implement JWT Auth', 'Create Task REST API', 'Fix dashboard filter bug',
    'Set up CI pipeline', 'Refactor task service', 'Add dark mode support', 'Optimize query indexing',
  ],
  Design: [
    'Dashboard Mockup', 'Mobile App Wireframes', 'Color palette & tokens', 'Chart UI polish',
  ],
  Documentation: [
    'Write API docs', 'Update README', 'Write security guide',
  ],
  Testing: [
    'Write unit tests for auth', 'Load test the API', 'E2E test task flow',
  ],
  Meeting: [
    'Sprint planning', 'Weekly sync with stakeholders', 'Architecture review',
  ],
  Other: [
    'Product launch page', 'Demo video for investors',
  ],
};

const statuses = ['todo', 'in-progress', 'completed'];

const buildTasks = (assigneeId, adminId) => {
  const tasks = [];
  let i = 0;
  for (const [category, titles] of Object.entries(taskTitles)) {
    for (const title of titles) {
      const status = statuses[i % statuses.length];
      const priority = ['high', 'medium', 'low'][i % 3];
      // Spread due dates across the last ~5 months (completed) and next ~3 weeks (open).
      const offsetDays = status === 'completed' ? -(i * 7 + 3) : (i % 4) * 5 + 2;
      tasks.push({
        title,
        description: `Sample ${category.toLowerCase()} task: ${title}.`,
        category,
        priority,
        status,
        dueDate: daysFromNow(offsetDays),
        userId: assigneeId,
        assignedBy: adminId,
      });
      i += 1;
    }
  }
  return tasks;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing users & tasks');

    const createdUsers = await User.create(sampleUsers);
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const regularUsers = createdUsers.filter((u) => u.role === 'user');

    const allTasks = [];
    for (const user of regularUsers) {
      allTasks.push(...buildTasks(user._id, adminUser._id));
    }

    await Task.create(allTasks);

    console.log('Seed complete!');
    console.log(`Created ${createdUsers.length} users and ${allTasks.length} tasks`);
    console.log('----------------------------------');
    console.log('Admin login: admin@taskflow.com / admin123');
    console.log('User login:  demo@taskflow.com    / demo123');
    console.log('User login:  sara@taskflow.com    / sara123');
    console.log('User login:  mike@taskflow.com    / mike123');
    console.log('----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seed();