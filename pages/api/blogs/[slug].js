// pages/api/blogs/[slug].js
import connectDB from "@/lib/mongodb"
import Blog from "@/models/Post"
import { redis } from "@/lib/redis"

export default async function handler(req, res) {
  await connectDB()
  const { slug, action } = req.query

  try {
    // 1️⃣ GET a single post (only non-deleted)
    if (req.method === "GET" && !action) {
      const blog = await Blog.findOne({ slug, deleted: false }).lean()
      if (!blog) return res.status(404).json({ error: "Blog not found" })

      // Merge Redis views for today
      const today = new Date().toISOString().split("T")[0]
      const redisKey = `view:blog:${slug}:${today}`
      const redisViews = parseInt((await redis.get(redisKey)) || "0", 10)
      const totalViews = (blog.views || 0) + redisViews

      return res.status(200).json({
        ...blog,
        views: totalViews,
        image: blog.featuredImage || "",
      })
    }

    // 2️⃣ Increment views (Redis & MongoDB)
    if (req.method === "POST" && action === "view") {
      const blog = await Blog.findOne({ slug })
      if (!blog) return res.status(404).json({ error: "Blog not found" })

      const today = new Date().toISOString().split("T")[0]
      const redisKey = `view:blog:${slug}:${today}`
      await redis.incr(redisKey)

      await Blog.updateOne(
        { slug },
        {
          $inc: { views: 1 },
          $set: { [`viewsByDate.${today}`]: (blog.viewsByDate?.[today] || 0) + 1 },
        }
      )

      return res.status(200).json({ message: "View counted" })
    }

    // 3️⃣ Full update (PUT)
    if (req.method === "PUT") {
      const updated = await Blog.findOneAndUpdate(
        { slug },
        req.body,
        { new: true, runValidators: true }
      ).lean()
      if (!updated)
        return res.status(404).json({ error: "Blog not found for update" })

      return res.status(200).json({
        ...updated,
        image: updated.featuredImage || "",
      })
    }

    // 4️⃣ Restore soft-deleted post (PATCH ?action=restore)
    if (req.method === "PATCH" && action === "restore") {
      const restored = await Blog.findOneAndUpdate(
        { slug },
        { deleted: false },
        { new: true }
      ).lean()
      if (!restored)
        return res.status(404).json({ error: "Blog not found for restore" })

      return res.status(200).json({
        ...restored,
        image: restored.featuredImage || "",
      })
    }

    // 5️⃣ Soft-delete (move to trash) on DELETE
    if (req.method === "DELETE") {
      const trashed = await Blog.findOneAndUpdate(
        { slug },
        { deleted: true },
        { new: true }
      ).lean()
      if (!trashed)
        return res.status(404).json({ error: "Blog not found for deletion" })

      return res.status(200).json({ message: "Moved to trash" })
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"])
    return res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error("[Blog API Error]", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
