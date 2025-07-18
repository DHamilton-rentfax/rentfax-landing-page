import connectDB from "@/lib/mongodb";
import Blog from "@/models/Post";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Create rate limiter: 10 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "60s"),
  analytics: true,
});

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "anonymous";

  // Rate limit check
  const { success, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    res.setHeader("Retry-After", Math.ceil((reset - Date.now()) / 1000));
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Missing or invalid slug" });
  }

  try {
    const existing = await Blog.findOne({ slug, deleted: false }).lean();
    const available = !existing;
    return res.status(200).json({ available, remaining });
  } catch (err) {
    console.error("[Slug Check Error]", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
