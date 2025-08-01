// scripts/convertAuthorStrings.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Explicit collection names to prevent Mongoose guessing
const userSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  name: String,
}, { collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  title: String,
  author: mongoose.Schema.Types.Mixed,
  authorName: String,
}, { collection: 'posts' });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('❌ MONGODB_URI not defined in .env.local');

async function connectDB() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅ Connected to MongoDB:', mongoose.connection.name);
}

async function convertAuthorStrings() {
  await connectDB();

  const stringAuthorPosts = await Post.find({
    author: { $type: 'string' },
  });

  console.log(`🔍 Found ${stringAuthorPosts.length} posts with string authors`);

  for (const post of stringAuthorPosts) {
    const stringName = post.author;

    if (!stringName) {
      console.warn(`⚠️ Skipping post "${post.title}" — no author value`);
      continue;
    }

    const user = await User.findOne({
      $or: [
        { fullName: stringName },
        { name: stringName },
        { email: stringName },
      ],
    });

    if (user) {
      post.author = user._id;
      post.authorName = user.fullName || user.email;
      await post.save();
      console.log(`✅ Updated "${post.title}" → ${user.fullName || user.email}`);
    } else {
      console.warn(`⚠️ No matching user found for "${post.title}" → "${stringName}"`);
    }
  }

  console.log('🎉 Conversion complete!');
  process.exit(0);
}

convertAuthorStrings().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
