// pages/api/blogs/index.js
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  await connectDB();

  // ─── GET ────────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      // parse ?deleted=true or false (default to false)
      const showDeleted = req.query.deleted === "true";

      // find matching posts
      const blogs = await Blog.find({ deleted: showDeleted })
        .sort({ date: -1 })
        .lean();

      // normalize payload for front-end
      const adapted = blogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        image: b.featuredImage || "",
        author: b.author,
        category: b.category || "",
        date: b.date?.toISOString() || null,
        status: b.deleted ? "Trash" : "Published",
        deleted: b.deleted,
      }));

      return res.status(200).json(adapted);
    } catch (err) {
      console.error("[GET /api/blogs] ", err);
      return res.status(500).json({ error: "Failed to fetch blogs" });
    }
  }

  // ─── POST ───────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const newBlog = new Blog(req.body);
      await newBlog.save();
      return res.status(201).json({
        slug: newBlog.slug,
        title: newBlog.title,
        excerpt: newBlog.excerpt,
        image: newBlog.featuredImage || "",
        author: newBlog.author,
        category: newBlog.category || "",
        date: newBlog.date?.toISOString() || null,
        status: newBlog.deleted ? "Trash" : "Published",
        deleted: newBlog.deleted,
      });
    } catch (err) {
      console.error("[POST /api/blogs] ", err);
      return res.status(500).json({ error: "Failed to create blog" });
    }
  }

  // ─── Other methods not allowed ─────────────────────────────────
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
