import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_THRESHOLD_SECONDS = 300; // 5 minutes


// ✅ Token Verification Middleware
export async function verifyToken(req, res, next) {
  try {
    await connectDB();

    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      await logAudit("unauthorized", req, "Missing token");
      return res.status(401).json({ success: false, error: "No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.id) {
      await logAudit("unauthorized", req, "Malformed token payload");
      return res.status(401).json({ success: false, error: "Invalid token payload." });
    }

    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      await logAudit("unauthorized", req, "User not found");
      return res.status(401).json({ success: false, error: "User not found." });
    }

    req.user = user;

    // Auto-refresh token if expiring soon
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - now;

    if (expiresIn < REFRESH_THRESHOLD_SECONDS) {
      const refreshedToken = jwt.sign(
        { id: user._id, role: user.role, status: user.status },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.setHeader("X-Refreshed-Token", refreshedToken);
    }

    return next();
  } catch (err) {
    console.error("[verifyToken] Error:", err.message);
    await logAudit("unauthorized", req, err.message);
    return res.status(401).json({ success: false, error: "Invalid or expired token." });
  }
}

// ✅ Admin-only Route Middleware
export function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Admin access required." });
  }
  return next();
}

// ✅ Audit Log Helper
async function logAudit(action, req, message = "") {
  try {
    await AuditLog.create({
      user: req.user?._id || null,
      action,
      model: "Auth",
      target: req.user?._id || null,
      ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      description: message,
    });
  } catch (err) {
    console.error("❌ Failed to log audit:", err.message);
  }
}
