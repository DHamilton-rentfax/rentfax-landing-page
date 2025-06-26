// pages/api/comments/[id].js
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  const isAdmin = session?.user?.roles?.includes('admin');

  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
      await Comment.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'PATCH') {
      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ error: 'Comment not found' });

      comment.approved = !comment.approved;
      await comment.save();

      return res.status(200).json({ success: true, approved: comment.approved });
    }

    res.setHeader('Allow', ['DELETE', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('❌ API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
