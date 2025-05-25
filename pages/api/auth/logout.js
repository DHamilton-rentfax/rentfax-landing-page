// pages/api/auth/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  console.log("🔒 [LOGOUT] API hit");

  if (req.method !== 'POST') {
    console.log("❌ Method not allowed on logout:", req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Clear the HttpOnly token cookie
  res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    })
  );

  console.log("🍪 Token cookie cleared");
  return res.status(200).json({ ok: true });
}
