const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
  const preferMemory = process.env.USE_MEMORY_DB === 'true';

  if (!preferMemory) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      console.warn(` Could not connect to local/remote MongoDB (${uri}): ${err.message}`);
      console.log(' Starting In-Memory MongoDB server for zero-friction local development...');
    }
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(` In-Memory MongoDB Connected at ${memoryUri}`);
    return conn;
  } catch (memErr) {
    console.error(` In-Memory MongoDB failed to start:`, memErr);
    throw memErr;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
