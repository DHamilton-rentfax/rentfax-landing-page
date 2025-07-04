import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import allowCors from "@/middleware/cors";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { email = "", password = "" } = req.body;

    const cleanedEmail = email.toLowerCase().trim();
    const cleanedPassword = password.trim();

    if (!cleanedEmail || !cleanedPassword) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: cleanedEmail }).lean();

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(cleanedPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        success: false,
        error: "Account is pending approval.",
      });
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
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
}

export default allowCors(handler);
