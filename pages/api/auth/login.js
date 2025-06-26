// pages/api/auth/login.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await dbConnect();

  const { email = "", password = "" } = req.body;
  const cleanedEmail = email.toLowerCase().trim();
  const cleanedPassword = password.trim();

  console.log("📩 Login request received:", { email: cleanedEmail });

  if (!cleanedEmail || !cleanedPassword) {
    console.warn("⚠️ Missing email or password in request.");
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: cleanedEmail });

    console.log("👤 User found:", user ? { email: user.email, status: user.status } : "No user found");

    if (!user || !user.passwordHash) {
      console.warn("❌ Invalid email or missing passwordHash.");
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(cleanedPassword, user.passwordHash);
    console.log("🔐 Password match:", passwordMatches);

    if (!passwordMatches) {
      console.warn("❌ Password mismatch.");
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (user.status === "pending") {
      console.warn("⏳ Account pending approval.");
      return res.status(403).json({ error: "Account is pending approval." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        roles: user.roles,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    console.log("✅ Login successful. Sending response...");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
