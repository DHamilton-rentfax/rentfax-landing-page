import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // ✅ keep this for clean connection behavior
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected to:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }

  return cached.conn;
}

export default connectDB;
