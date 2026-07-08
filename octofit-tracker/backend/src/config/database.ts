import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
  } catch (error) {
    console.warn('MongoDB connection unavailable, continuing without it:', error);
  }
}

export default db;
