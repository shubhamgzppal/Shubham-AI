import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to MongoDB');
    return;
  }
  
  return mongoose.connect(MONGODB_URI);
}
