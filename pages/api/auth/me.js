// pages/api/auth/me.js
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
  // 1) Only GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // 2) Connect to DB (catch/connect errors explicitly)
  try {
    await dbConnect()
  } catch (err) {
    console.error("[AUTH ME] DB connection error:", err)
    // 500 because we really couldn’t talk to the DB
    return res.status(500).json({ user: null, error: "DB connection failed" })
  }

  // 3) Pull token from cookie
  const token = req.cookies?.token
  if (!token) {
    // not logged in
    return res.status(200).json({ user: null })
  }

  try {
    // 4) Verify & decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // your login handler signs `{ id: user._id, ... }`
    const userId = decoded.id
    if (!userId) {
      console.error("[AUTH ME] JWT payload missing `id`:", decoded)
      return res.status(200).json({ user: null })
    }

    // 5) Lookup user by ID
    const userDoc = await User.findById(userId).select("-password")
    if (!userDoc) {
      return res.status(200).json({ user: null })
    }

    // 6) Return minimal profile
    return res.status(200).json({
      user: {
        id: userDoc._id,
        email: userDoc.email,
        isAdmin: Boolean(userDoc.isAdmin),
      },
    })
  } catch (err) {
    console.error("[AUTH ME] JWT verify or user lookup failed:", err)
    // still 200, just no user
    return res.status(200).json({ user: null })
  }
}
