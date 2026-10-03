require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');
const { seedAll } = require('./src/utils/seedRunner');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Check if database has users; if empty, run automatic seeding for instant demo usability
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log(' Database is empty. Seeding realistic SkillBridge demo data...');
      await seedAll();
    } else {
      console.log(` Database already contains ${userCount} users. Ready!`);
    }

    // 3. Start Express server
    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  SkillBridge Backend API running on port ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      // Do not crash in development
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(`Uncaught Exception Error: ${err.message}`);
    });
  } catch (err) {
    console.error(`Server initialization failed: ${err.message}`);
    process.exit(1);
  }
};

startServer();
