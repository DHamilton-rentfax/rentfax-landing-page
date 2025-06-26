import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

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

    // Validate
    if (!blogSlug || !content || (!name && !isAuthed)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: blogSlug, content, and name/email.',
      });
    }

    const commenterName = isAuthed ? session.user.name || 'RentFAX User' : name.trim();
    const commenterEmail = isAuthed ? session.user.email : email?.trim();
    const avatarUrl = avatar || '';

    try {
      // Create comment in database
      const newComment = await Comment.create({
        blogSlug,
        content: content.trim(),
        name: commenterName,
        email: commenterEmail,
        avatar: avatarUrl,
        approved: false,
      });

      // Send notification to admin
      try {
        await mg.messages.create(DOMAIN, {
          from: FROM,
          to: ADMIN_EMAIL,
          subject: `💬 New Comment on ${blogSlug}`,
          html: `
            <h3>New comment awaiting approval</h3>
            <p><strong>${commenterName}</strong> (${commenterEmail}) said:</p>
            <blockquote style="margin: 10px 0; padding: 10px; background: #f4f4f4;">${content}</blockquote>
            <p><strong>Slug:</strong> ${blogSlug}</p>
          `,
        });
      } catch (mailError) {
        console.error('⚠️ Mailgun error (comment still saved):', mailError);
      }

      return res.status(201).json({
        success: true,
        message: 'Comment submitted for approval.',
        commentId: newComment._id,
      });
    } catch (err) {
      console.error('❌ Comment creation error:', err);
      return res.status(500).json({ success: false, error: 'Failed to save comment.' });
    }
  }

  if (req.method === 'GET') {
    const { blogSlug } = req.query;

    if (!blogSlug) {
      return res.status(400).json({ success: false, error: 'Missing blogSlug query param.' });
    }

    try {
      const comments = await Comment.find({ blogSlug, approved: true }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, comments });
    } catch (err) {
      console.error('❌ Failed to fetch comments:', err);
      return res.status(500).json({ success: false, error: 'Could not fetch comments.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
    allowed: ['GET', 'POST'],
  });
}
