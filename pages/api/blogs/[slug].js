// pages/api/blogs/[slug].js

import connectDB from "@/lib/mongodb";
import Blog from "@/models/Post";
import { redis } from "@/lib/redis";
import allowCors from "@/middleware/cors";

async function handler(req, res) {
  await connectDB();
  const { slug, action } = req.query;

  try {
    // 1️⃣ GET single blog post (with Redis view count)
    if (req.method === "GET" && !action) {
      const blog = await Blog.findOne({ slug, deleted: false }).lean();
      if (!blog) return res.status(404).json({ success: false, error: "Blog not found" });

      // Redis view merging
      const today = new Date().toISOString().split("T")[0];
      const redisKey = `view:blog:${slug}:${today}`;
      let redisViews = 0;

      try {
        const result = await redis.get(redisKey);
        redisViews = parseInt(result || "0", 10);
      } catch (err) {
        console.warn("Redis get error:", err.message);
      }

      const totalViews = (blog.views || 0) + redisViews;

      return res.status(200).json({
        success: true,
        post: {
          slug: blog.slug,
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          image: blog.featuredImage || "",
          author: blog.author || "Unknown",
          category: blog.category || "uncategorized",
          date: blog.createdAt?.toISOString() || null,
          status: blog.status,
          views: totalViews,
        },
      });
    }

    // 2️⃣ Increment Redis views
    if (req.method === "POST" && action === "view") {
      const blog = await Blog.findOne({ slug });
      if (!blog) return res.status(404).json({ success: false, error: "Blog not found" });

      const today = new Date().toISOString().split("T")[0];
      const redisKey = `view:blog:${slug}:${today}`;
      await redis.incr(redisKey);

      await Blog.updateOne(
        { slug },
        {
          $inc: { views: 1 },
          $set: {
            [`viewsByDate.${today}`]: (blog.viewsByDate?.[today] || 0) + 1,
          },
        }
      );

      return res.status(200).json({ success: true, message: "View counted" });
    }

    // 3️⃣ Update a blog post
    if (req.method === "PUT") {
      const updated = await Blog.findOneAndUpdate({ slug }, req.body, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated)
        return res.status(404).json({ success: false, error: "Blog not found for update" });

      return res.status(200).json({
        success: true,
        post: {
          ...updated,
          image: updated.featuredImage || "",
        },
      });
    }

    // 4️⃣ Restore blog (from trash)
    if (req.method === "PATCH" && action === "restore") {
      const restored = await Blog.findOneAndUpdate(
        { slug },
        { deleted: false },
        { new: true }
      ).lean();

      if (!restored)
        return res.status(404).json({ success: false, error: "Blog not found for restore" });

      return res.status(200).json({
        success: true,
        post: {
          ...restored,
          image: restored.featuredImage || "",
        },
      });
    }

    // 5️⃣ Soft-delete blog
    if (req.method === "DELETE") {
      const trashed = await Blog.findOneAndUpdate(
        { slug },
        { deleted: true },
        { new: true }
      ).lean();

      if (!trashed)
        return res.status(404).json({ success: false, error: "Blog not found for deletion" });

      return res.status(200).json({ success: true, message: "Moved to trash" });
    }

    // ❌ Unsupported method
    res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("[Blog API Error]", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export default allowCors(handler);
