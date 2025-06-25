import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ Please define MONGODB_URI in .env.local');
}

// Global cache for hot reload (Next.js in dev)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'rentfax_blog',       // ✅ Explicitly target the blog database
      bufferCommands: false,        // ✅ Disable mongoose buffering
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected to rentfax_blog');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }

  return cached.conn;
}

export default connectDB;
