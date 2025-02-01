// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectDB() {
  try {
    // Check if we already have a connection
    if (mongoose.connections[0].readyState) {
      console.log('Using existing connection');
      return;
    }

    // Create new connection
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Handle connection errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

export default connectDB;