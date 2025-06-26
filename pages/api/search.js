import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import Fuse from 'fuse.js';
import { stripHtml } from 'string-strip-html';

export default async function handler(req, res) {
  const { q = '', page = 1, author } = req.query;
  const pageSize = 10;
  const currentPage = Math.max(1, parseInt(page));

  await connectDB();

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ results: [], total: 0 });
  }

  try {
    const mongoQuery = { deleted: false, status: 'published' };

    if (author) {
      const user = await User.findOne({ email: author }).select('_id');
      if (user) {
        mongoQuery.author = user._id;
      } else {
        console.warn(`⚠️ No user found with email: ${author}`);
      }
    }

    const posts = await Post.find(mongoQuery)
      .select('title excerpt slug')
      .lean();

    const fuse = new Fuse(posts, {
      keys: ['title', 'excerpt'],
      includeMatches: true,
      threshold: 0.4,
      minMatchCharLength: 2,
    });

    const allResults = fuse.search(q.trim());

    const paginated = allResults.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    const results = paginated.map(({ item, matches }) => ({
      title: item.title,
      slug: item.slug,
      excerpt: stripHtml(item.excerpt || '').result.slice(0, 200),
      highlight:
        matches?.map((m) => ({
          key: m.key,
          indices: m.indices,
        })) || [],
    }));

    return res.status(200).json({
      results,
      total: allResults.length,
    });
  } catch (err) {
    console.error('❌ Search API error:', err);
    return res.status(500).json({ results: [], total: 0 });
  }
}
