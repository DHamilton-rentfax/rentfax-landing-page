// pages/api/admin/pending-editors.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // TODO: add your own authentication check here (e.g. verify JWT cookie)

  await dbConnect();
  const pending = await User.find({ status: "pending" }).select(
    "email createdAt"
  );
  return res.status(200).json(pending);
}
