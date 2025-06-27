import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "mail.rentfax.io";
const MAILGUN_FROM = process.env.MAILGUN_FROM || "no-reply@mail.rentfax.io";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@rentfax.io";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://rentfax.io";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect();

  const { email = "", password = "" } = req.body;
  const cleanedEmail = email.toLowerCase().trim();
  const cleanedPassword = password.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail) || cleanedPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password too short.",
    });
  }

  try {
    const existingUser = await User.findOne({ email: cleanedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "That email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(cleanedPassword, 12);

    const newUser = await User.create({
      email: cleanedEmail,
      passwordHash: hashedPassword,
      roles: ["editor"],
      status: "pending",
    });

    console.log("✅ New user created:", newUser.email);

    // Fire admin notification via Mailgun (non-blocking)
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

    return res.status(201).json({
      success: true,
      message: "Registration submitted. Awaiting admin approval.",
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}
