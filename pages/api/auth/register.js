// pages/api/auth/register.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Mailgun setup
import formData from "form-data";
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,           // must be set in env
});

// Destructure with sensible defaults
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "mail.rentfax.io";
const MAILGUN_FROM   = process.env.MAILGUN_FROM   || "no-reply@rentfax.io";
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "info@rentfax.io";
const NEXTAUTH_URL   = process.env.NEXTAUTH_URL   || "https://rentfax.io";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  await dbConnect();

  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required." });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "Email already registered." });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = new User({
    email: email.toLowerCase().trim(),
    password: hashed,
    roles: ["editor"],
    status: "pending",
  });
  await user.save();

  // Send notification email to admin via Mailgun
  try {
    await mg.messages.create(MAILGUN_DOMAIN, {
      from: MAILGUN_FROM,
      to: [ADMIN_EMAIL],
      subject: "🆕 New Editor Signup Pending Approval",
      html: `
        <p>A new editor has registered and awaits your approval:</p>
        <ul>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Signed up at:</strong> ${user.createdAt.toLocaleString()}</li>
        </ul>
        <p>
          <a href="${NEXTAUTH_URL}/admin/approvals">
            Review pending editors
          </a>
        </p>
      `,
    });
  } catch (err) {
    console.error("Mailgun error:", err);
  }

  return res.status(201).json({
    success: true,
    message: "Registration received—pending admin approval.",
  });
}
