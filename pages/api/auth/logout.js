import { serialize } from "cookie";
import allowCors from "@/middleware/cors";

function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Set-Cookie", serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  }));

  return res.status(200).json({ success: true, message: "Logged out successfully" });
}

export default allowCors(handler);
