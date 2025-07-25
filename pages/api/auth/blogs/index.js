import connectDB from '@/lib/mongodb';
import Blog from '@/models/Post';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Consider tightening for production
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  if (req.method === 'GET') {
    try {
      const blogs = await Blog.find({
        deleted: { $ne: true },
        status: 'published',
        title: { $exists: true, $ne: '' },
        content: { $exists: true, $ne: '' }
      }).sort({ createdAt: -1 }); // ✅ FIXED

      const adapted = blogs.map(blog => ({
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        image: blog.featuredImage || '',
        author: blog.author,
        category: blog.category || '',
        date: blog.date?.toISOString() || blog.createdAt?.toISOString() || null, // ✅ FIXED
        status: blog.deleted ? 'Trash' : blog.status === 'published' ? 'Published' : 'Draft',
        deleted: !!blog.deleted,
      }));

      return res.status(200).json(adapted);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });

      const user = verifyToken(token);

      const blog = new Blog(req.body);
      await blog.save();

      return res.status(201).json({
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        image: blog.featuredImage,
        author: blog.author,
        category: blog.category,
        date: blog.date?.toISOString() || blog.createdAt?.toISOString() || null,
        status: blog.status === 'published' ? 'Published' : 'Draft',
        deleted: false,
      });
    } catch (err) {
      console.error('Error creating blog:', err);
      return res.status(500).json({ error: 'Failed to create blog' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
