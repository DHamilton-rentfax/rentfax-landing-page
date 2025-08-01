// scripts/fixAuthorNames.js

require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

// ✅ Define Post schema here to avoid ESM import issues
const postSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  featuredImage: String,
  category: String,
  status: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  authorName: String,
  deleted: Boolean,
}, {
  timestamps: true
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

// ✅ Define User schema here too
const userSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  name: String,
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ✅ Manual MongoDB connection
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
      bufferCommands: false,
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

async function fixAuthorNames() {
  try {
    await connectDB();

    const posts = await Post.find({
      author: { $exists: true },
      $or: [
        { authorName: { $exists: false } },
        { authorName: null },
        { authorName: '' }
      ]
    });

    console.log(`📝 Found ${posts.length} post(s) to update...`);

    for (const post of posts) {
      const user = await User.findById(post.author);
      if (user) {
        post.authorName = user.fullName || user.name || user.email || 'Unknown';
        await post.save();
        console.log(`✅ Updated "${post.title}" → ${post.authorName}`);
      } else {
        console.warn(`⚠️ No user found for post "${post.title}"`);
      }
    }

    console.log('🎉 Done fixing author names!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing posts:', error);
    process.exit(1);
  }
}

fixAuthorNames();
