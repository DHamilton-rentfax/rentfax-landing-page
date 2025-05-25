import { verifyToken } from './auth';

export const requireAuth = (handler) => async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = verifyToken(token);
    req.user = decoded;
    return handler(req, res);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
