import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import allowCors from "@/middleware/cors";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();
  } catch (err) {
    console.error("❌ [AUTH ME] DB connection failed:", err);
    return res.status(500).json({ user: null, error: "Database error" });
  }

  const token = req.cookies?.token;
  if (!token) {
    return res.status(200).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        status: user.status,
        isAdmin: !!user.isAdmin,
      },
    });
  } catch (err) {
    console.error("❌ [AUTH ME] Token validation failed:", err);
    return res.status(200).json({ user: null });
  }
}

export default allowCors(handler);
