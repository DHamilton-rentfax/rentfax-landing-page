// pages/api/auth/blogs/index.js

import connectDB from '@/lib/mongodb';
import Blog from '@/models/Post';
import User from '@/models/User';
import '@/models/Author'; // ensure author model is registered
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  await connectDB();

  if (req.method === 'GET') {
    try {
      const token = req.cookies?.token || null;
      let isAdmin = false;

      if (token) {
        try {
          const decoded = verifyToken(token);
          const adminUser = await User.findById(decoded.id);
          if (adminUser?.role === 'admin') isAdmin = true;
        } catch (err) {
          console.warn("Invalid token in GET /api/auth/blogs");
        }
      }

      const query = isAdmin
        ? {}
        : {
            deleted: { $ne: true },
            status: 'published',
            title: { $exists: true, $ne: '' },
            content: { $exists: true, $ne: '' }
          };

      const blogs = await Blog.find(query)
        .populate('author', 'fullName email avatar bio')
        .sort({ createdAt: -1 })
        .lean();

      const adapted = blogs.map((blog) => {
        const isPopulated = blog.author && typeof blog.author === 'object';

        const authorName = isPopulated
          ? blog.author.fullName || blog.author.email || blog.authorName || 'Unknown'
          : blog.authorName || (typeof blog.author === 'string' ? blog.author : 'Unknown');

        const authorAvatar = isPopulated ? blog.author.avatar || '' : '';
        const authorBio = isPopulated ? blog.author.bio || '' : '';

        return {
          slug: blog.slug?.trim(),
          title: blog.title,
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          image: blog.featuredImage || '',
          author: authorName,
          authorName,
          authorAvatar,
          authorBio,
          category: blog.category || '',
          date: blog.date?.toISOString() || blog.createdAt?.toISOString() || null,
          status: blog.deleted ? 'Trash' : blog.status === 'published' ? 'Published' : 'Draft',
          deleted: !!blog.deleted,
          views: blog.views || 0,
        };
      });

      console.log(`[BLOG_GET] ${new Date().toISOString()} - Adapted ${adapted.length} blogs`);
      return res.status(200).json({ success: true, posts: adapted });
    } catch (err) {
      console.error('[Blog API Error - GET]', err);
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ error: 'User not found' });

      const blog = new Blog({
        ...req.body,
        author: user._id,
        authorName: user.fullName || user.email || 'Unknown',
      });

      await blog.save();

      console.log(`[BLOG_POST] ${new Date().toISOString()} - Blog created by ${blog.authorName}`);

      return res.status(201).json({
        slug: blog.slug?.trim(),
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        image: blog.featuredImage || '',
        author: blog.authorName,
        authorName: blog.authorName,
        authorAvatar: user.avatar || '',
        authorBio: user.bio || '',
        category: blog.category || '',
        date: blog.date?.toISOString() || blog.createdAt?.toISOString() || null,
        status: blog.status === 'published' ? 'Published' : 'Draft',
        deleted: false,
      });
    } catch (err) {
      console.error('[Blog API Error - POST]', err);
      return res.status(500).json({ error: 'Failed to create blog' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
