import { verifyToken } from './auth';

/**
 * Middleware to protect API routes with JWT auth.
 * Attaches `req.user` if valid.
 */
export const requireAuth = (handler) => async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized – no token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Unauthorized – invalid token' });
    }

    req.user = decoded; // Attach decoded user payload to request
    return handler(req, res);
  } catch (err) {
    console.error('❌ Auth error:', err.message || err);
    return res.status(401).json({ success: false, error: 'Unauthorized – auth check failed' });
  }
};
