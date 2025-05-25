// pages/api/auth/login.js
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function handler(req, res) {
  console.log("🔐 [LOGIN] API hit")

  if (req.method !== 'POST') {
    console.log("❌ Method not allowed:", req.method)
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  await dbConnect()
  const { email, password } = req.body
  console.log("📨 Login submitted → Email:", email)

  try {
    const user = await User.findOne({ email })
    console.log("👤 Fetched user:", user)

    if (!user) {
      console.log("❌ User not found")
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log("🔑 Password match:", isMatch)

    if (!isMatch) {
      console.log("❌ Password mismatch")
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    console.log("🔐 JWT created")

    // Serialize as HttpOnly cookie
    const cookieStr = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 3600, // 7 days in seconds
    })
    res.setHeader('Set-Cookie', cookieStr)
    console.log("🍪 Cookie set:", cookieStr)

    // Return minimal user info
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    })
  } catch (err) {
    console.error("💥 Login error:", err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
