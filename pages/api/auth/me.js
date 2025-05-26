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
  try {
    await dbConnect();
  } catch (err) {
    console.error("[AUTH ME] DB connection error:", err);
    return res.status(500).json({ user: null, error: "DB connection failed" });
  }

  // 3) Pull token from cookie
  const token = req.cookies?.token;
  if (!token) {
    return res.status(200).json({ user: null });
  }

  try {
    // 4) Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    if (!userId) {
      console.error("[AUTH ME] JWT payload missing `id`:", decoded);
      return res.status(200).json({ user: null });
    }

    // 5) Lookup user, include roles & status
    const userDoc = await User.findById(userId).select("-password");
    if (!userDoc) {
      return res.status(200).json({ user: null });
    }

    // 6) Return full profile for client
    return res.status(200).json({
      user: {
        id: userDoc._id,
        email: userDoc.email,
        isAdmin: Boolean(userDoc.isAdmin),
        roles: userDoc.roles,       // <-- new
        status: userDoc.status,     // <-- new
      },
    });
  } catch (err) {
    console.error("[AUTH ME] JWT verify or user lookup failed:", err);
    return res.status(200).json({ user: null });
  }
}
