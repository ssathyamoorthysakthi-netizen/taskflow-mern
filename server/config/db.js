const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB error: ${err.message}`);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      bufferCommands: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = connectDB;