/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

// Import database and environment configuration
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Disable strict query mode for flexibility in MongoDB queries
mongoose.set('strictQuery', false);

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
