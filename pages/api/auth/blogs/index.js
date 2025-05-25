import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const blogs = await Blog.find({ deleted: { $ne: true } }).sort({ date: -1 });
      return res.status(200).json(blogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });

      const user = verifyToken(token); // throws error if invalid

      const blog = new Blog(req.body);
      await blog.save();
      return res.status(201).json(blog);
    } catch (err) {
      console.error('Error creating blog:', err);
      return res.status(500).json({ error: 'Failed to create blog' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
