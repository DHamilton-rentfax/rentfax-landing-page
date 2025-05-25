// pages/api/auth/me.js
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  console.log("🔍 [AUTH ME] API hit");

  // Ensure DB connection
  await dbConnect();

  // Read token from HttpOnly cookie
  const token = req.cookies?.token;
  if (!token) {
    console.log("⚠️ No token cookie present");
    return res.status(200).json({ user: null });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token valid for user id:", decoded.id);

    // Optionally re-fetch user data (excluding sensitive fields)
    const userDoc = await User.findById(decoded.id).select('-password');
    if (!userDoc) {
      console.log("❌ User not found in DB");
      return res.status(200).json({ user: null });
    }

    // Return minimal user info
    const user = {
      id: userDoc._id,
      email: userDoc.email,
      isAdmin: userDoc.isAdmin || false,
    };
    return res.status(200).json({ user });
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(200).json({ user: null });
  }
}
