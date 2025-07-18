// pages/api/redis-test.js
import { redis } from '@/lib/redis';

export default async function handler(req, res) {
  try {
    await redis.set('test-key', '123');
    const value = await redis.get('test-key');
    res.status(200).json({ success: true, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
