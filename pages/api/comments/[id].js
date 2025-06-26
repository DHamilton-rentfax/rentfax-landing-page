// pages/api/comments/[id].js

import connectDB from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import Comment from '@/models/Comment';

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  const isAdmin = session?.user?.roles?.includes('admin');

  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
  }

  const { id } = req.query;

  if (!id || id.length < 10) {
    return res.status(400).json({ error: 'Invalid or missing comment ID.' });
  }

  try {
    if (req.method === 'DELETE') {
      const deleted = await Comment.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Comment not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully.',
        deletedComment: deleted,
      });
    }

    if (req.method === 'PATCH') {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }

      comment.approved = !comment.approved;
      await comment.save();

      return res.status(200).json({
        success: true,
        message: `Comment ${comment.approved ? 'approved' : 'unapproved'}.`,
        updatedComment: comment,
      });
    }

    res.setHeader('Allow', ['DELETE', 'PATCH']);
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed.`,
      allowedMethods: ['DELETE', 'PATCH'],
    });
  } catch (err) {
    console.error('❌ API error in /api/comments/[id]:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
