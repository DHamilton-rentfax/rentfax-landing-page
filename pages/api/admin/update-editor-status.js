// pages/api/admin/update-editor-status.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // TODO: add your own authentication check here (e.g. verify JWT cookie)

  const { userId, action } = req.body;
  if (!userId || !["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  await dbConnect();
  const status = action === "approve" ? "active" : "rejected";
  await User.findByIdAndUpdate(userId, { status });
  return res.status(200).json({ success: true });
}
