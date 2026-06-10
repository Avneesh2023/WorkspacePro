const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const isLocalhost = process.env.MONGO_URI.includes('127.0.0.1') || process.env.MONGO_URI.includes('localhost');
    
    try {
      // Timeout local connection attempts quickly (3s) to fallback to in-memory DB
      const options = isLocalhost ? { serverSelectionTimeoutMS: 3000 } : {};
      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      if (isLocalhost) {
        console.log('Local MongoDB connection failed. Spinning up in-memory MongoDB database for development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
