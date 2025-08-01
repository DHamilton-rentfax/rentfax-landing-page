import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ Please define MONGODB_URI in .env.local');
}

const postSchema = new mongoose.Schema({}, { strict: false });
const Post = mongoose.model('Post', postSchema, 'posts');

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const posts = await Post.find({ slug: { $regex: /\s+$/ } });
    console.log(`🔍 Found ${posts.length} post(s) with trailing whitespace in slug`);

    for (const post of posts) {
      const cleaned = post.slug.trim();
      console.log(`✏️ Updating: "${post.slug}" → "${cleaned}"`);
      post.slug = cleaned;
      await post.save();
    }

    console.log('✅ Slug cleanup complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

run();
