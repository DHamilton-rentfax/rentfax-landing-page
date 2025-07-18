// pages/api/auth/register.js

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import formData from "form-data";
import Mailgun from "mailgun.js";
import allowCors from "@/middleware/cors";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "mail.rentfax.io";
const MAILGUN_FROM = process.env.MAILGUN_FROM || "no-reply@mail.rentfax.io";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@rentfax.io";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://rentfax.io";

async function handler(req, res) {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { email = "", password = "" } = req.body;
    const cleanedEmail = email.toLowerCase().trim();
    const cleanedPassword = password.trim();

    // ✅ Validate inputs
    if (!cleanedEmail || !cleanedPassword) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format.",
      });
    }

    if (cleanedPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters.",
      });
    }

    // ✅ Check for existing user
    const existingUser = await User.findOne({ email: cleanedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email is already registered.",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(cleanedPassword, 12);

    // ✅ Create new user
    const newUser = await User.create({
      email: cleanedEmail,
      passwordHash: hashedPassword,
      roles: ["editor"],
      status: "pending",
    });

    console.log("✅ New user created:", newUser.email);

    // ✅ Send admin email (non-blocking)
    mg.messages
      .create(MAILGUN_DOMAIN, {
        from: MAILGUN_FROM,
        to: ADMIN_EMAIL,
        subject: "🆕 New Editor Signup – Approval Needed",
        html: `
          <p>A new editor has registered on RentFAX:</p>
          <ul>
            <li><strong>Email:</strong> ${newUser.email}</li>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p><a href="${NEXTAUTH_URL}/admin/approvals">Review Pending Editor</a></p>
        `,
      })
      .then(() => console.log("📧 Admin notified via Mailgun"))
      .catch((mailError) =>
        console.warn("📭 Mailgun error (non-blocking):", mailError.message || mailError)
      );

    // ✅ Success response
    return res.status(201).json({
      success: true,
      message: "Registration submitted. Awaiting admin approval.",
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
}

// ✅ Wrap with CORS middleware
export default allowCors(handler);
