const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB'.yellow);
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination'.red);
      process.exit(0);
    });

  } catch (error) {
    console.error(`Database connection error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;