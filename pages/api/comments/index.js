import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // adjust path if different

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.mailgun.net',
});

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    }

    const { postId, text, avatar } = req.body;
    const authorEmail = session.user.email;

    if (!postId || !text) {
      return res.status(400).json({ error: 'Missing postId or comment text' });
    }

    try {
      const newComment = await Comment.create({
        post: postId,
        authorEmail,
        text,
        avatar,
      });

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.MAILGUN_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `💬 New comment on RentFAX`,
        text: `New comment posted:\n\n${text}\n\nFrom: ${authorEmail}\nPost ID: ${postId}`,
      });

      return res.status(201).json(newComment);
    } catch (error) {
      console.error('❌ Failed to post comment or send email:', error);
      return res.status(500).json({ error: 'Failed to post comment or send notification' });
    }
  }

  if (req.method === 'GET') {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: 'Missing postId in query' });
    }

    try {
      const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });
      return res.status(200).json(comments);
    } catch (error) {
      console.error('❌ Failed to fetch comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
