// pages/api/auth/me.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // 1) Only allow GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 2) Connect to DB
  await dbConnect();

  // 3) Pull token from cookie
  const token = req.cookies?.token;
  if (!token) {
    // not logged in
    return res.status(200).json({ user: null });
  }

  try {
    // 4) Verify & decode
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // 5) Lookup user (exclude password)
    const userDoc = await User.findById(userId).select("-password");
    if (!userDoc) {
      return res.status(200).json({ user: null });
    }

    // 6) Return minimal profile
    return res.status(200).json({
      user: {
        id: userDoc._id,
        email: userDoc.email,
        isAdmin: userDoc.isAdmin || false,
      },
    });
  } catch (err) {
    console.error("[AUTH ME] JWT verify failed:", err);
    return res.status(200).json({ user: null });
  }
}
