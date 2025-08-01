import connectDB from '@/lib/mongodb';
import Blog from '@/models/Post';
import User from '@/models/User'; // Ensure User model is registered

export default async function handler(req, res) {
  await connectDB();

  const slug = req.query.slug?.trim();

  try {
    const blog = await Blog.findOne({ slug })
      .populate('author', 'fullName email bio avatar') // ✅ Pulls everything needed for AuthorCard
      .lean();

    if (!blog) {
      console.warn(`[BLOG] Not found: ${slug}`);
      return res.status(404).json({ error: 'Blog not found' });
    }

    const authorName =
      blog.author?.fullName || blog.author?.email || blog.authorName || 'Unknown';

    const post = {
      ...blog,
      author: authorName,
      authorBio: blog.author?.bio || '',
      authorAvatar: blog.author?.avatar || '',
    };

    res.status(200).json(post);
  } catch (err) {
    console.error('[BLOG] Error loading post:', err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
}
