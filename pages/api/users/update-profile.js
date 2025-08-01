import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { fullName, bio, avatar } = req.body;
    user.fullName = fullName?.trim() || user.fullName;
    user.bio = bio?.trim() || "";
    user.avatar = avatar?.trim() || "";

    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[Update Profile Error]", err);
    return res.status(500).json({ error: "Server error" });
  }
}
