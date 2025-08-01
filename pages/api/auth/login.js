import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import allowCors from "@/middleware/cors";
import AuditLog from "@/models/AuditLog";

// Main handler
async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { email = "", password = "" } = req.body;
    const cleanedEmail = email.toLowerCase().trim();
    const cleanedPassword = password.trim();

    if (!cleanedEmail || !cleanedPassword) {
      await logAudit(null, "login_failed", "Missing email or password", req);
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: cleanedEmail });

    if (!user || !user.passwordHash) {
      await logAudit(null, "login_failed", "Invalid credentials", req);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(cleanedPassword, user.passwordHash);
    if (!isMatch) {
      await logAudit(user._id, "login_failed", "Incorrect password", req);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    if (user.status === "pending") {
      await logAudit(user._id, "login_blocked", "Pending approval", req);
      return res.status(403).json({
        success: false,
        error: "Account is pending approval.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
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
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    res.setHeader("Content-Type", "application/json");

    await logAudit(user._id, "login_success", "User logged in", req);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    await logAudit(null, "login_error", err.message, req);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
}

// Audit logger
async function logAudit(userId, action, description, req) {
  try {
    await AuditLog.create({
      user: userId || null,
      action,
      model: "Auth",
      target: userId || null,
      ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      description,
    });
  } catch (err) {
    console.error("❌ Failed to log audit:", err.message);
  }
}

export default allowCors(handler);
