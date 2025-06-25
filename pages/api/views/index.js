import connectDB from '@/lib/mongodb';
import View from '@/models/View';
import Post from '@/models/Post';

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection?.remoteAddress ||
    ''
  );
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { postId } = req.body;
  if (!postId) return res.status(400).json({ error: 'Missing postId' });

  const ip = getClientIP(req);

  try {
    const today = new Date().toISOString().slice(0, 10);

    // Track view record
    await View.create({ post: postId, ip });

    // Update Post views & viewsByDate
    const post = await Post.findById(postId);
    post.views += 1;

    const viewsByDate = post.viewsByDate || {};
    viewsByDate[today] = (viewsByDate[today] || 0) + 1;

    post.viewsByDate = viewsByDate;
    await post.save();

    res.status(200).json({ message: 'View recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to track view' });
  }
}
