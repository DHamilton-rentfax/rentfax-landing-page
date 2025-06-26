import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment'; // ✅ Correct model reference
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // ✅ Correct path

// 🔧 Mailgun Setup
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.mailgun.net',
});

const DOMAIN = process.env.MAILGUN_DOMAIN || 'mail.rentfax.io';
const FROM = process.env.MAILGUN_FROM || `no-reply@${DOMAIN}`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@rentfax.io';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    const isAuthed = !!session?.user?.email;

    const { blogSlug, content, name, email, avatar } = req.body;

    if (!blogSlug || !content || (!name && !isAuthed)) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const commenterName = isAuthed ? session.user.name || 'RentFAX User' : name;
    const commenterEmail = isAuthed ? session.user.email : email;

    try {
      const newComment = await Comment.create({
        blogSlug,
        content,
        name: commenterName,
        email: commenterEmail,
        avatar: avatar || '',
        approved: false,
      });

      await mg.messages.create(DOMAIN, {
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `💬 New Comment on ${blogSlug}`,
        html: `
          <h3>New comment awaiting approval</h3>
          <p><strong>${commenterName}</strong> (${commenterEmail}) said:</p>
          <blockquote>${content}</blockquote>
          <p><strong>Slug:</strong> ${blogSlug}</p>
        `,
      });

      return res.status(201).json({ success: true, message: 'Comment submitted for approval.' });
    } catch (err) {
      console.error('❌ Failed to create comment or send email:', err);
      return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  }

  if (req.method === 'GET') {
    const { blogSlug } = req.query;

    if (!blogSlug) {
      return res.status(400).json({ error: 'Missing blogSlug.' });
    }

    try {
      const comments = await Comment.find({ blogSlug, approved: true }).sort({ createdAt: -1 });
      return res.status(200).json(comments);
    } catch (err) {
      console.error('❌ Failed to fetch comments:', err);
      return res.status(500).json({ error: 'Server error fetching comments.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
