// pages/api/blogs/index.js
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Post";

export default async function handler(req, res) {
  await connectDB();

  // ─── GET All Blogs ──────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const showDeleted = req.query.deleted === "true";

      const blogs = await Blog.find({ deleted: showDeleted })
        .sort({ date: -1 })
        .lean();

      const adapted = blogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        image: b.featuredImage || "",
        author: b.author,
        category: b.category || "",
        date: b.date?.toISOString() || null,
        status: b.deleted ? "Trash" : b.status === "published" ? "Published" : "Draft",
        deleted: b.deleted,
      }));

      return res.status(200).json(adapted);
    } catch (err) {
      console.error("[GET /api/blogs] Error:", err);
      return res.status(500).json({ error: "Failed to fetch blogs" });
    }
  }

  // ─── POST New Blog ──────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      console.log("[POST /api/blogs] Incoming body:", req.body);

      const newBlog = new Blog({
        title: req.body.title,
        subtitle: req.body.subtitle || "",
        slug: req.body.slug,
        content: req.body.content,
        excerpt: req.body.excerpt,
        featuredImage: req.body.featuredImage || "",
        tags: req.body.tags || [],
        metaTitle: req.body.metaTitle || req.body.title,
        metaDescription: req.body.metaDescription || req.body.excerpt,
        keywords: req.body.keywords || "",
        author: req.body.author || "Admin",
        category: req.body.category || "uncategorized",
        status: req.body.status || "draft",
        date: req.body.date || new Date(),
      });

      await newBlog.save();

      return res.status(201).json({
        slug: newBlog.slug,
        title: newBlog.title,
        excerpt: newBlog.excerpt,
        image: newBlog.featuredImage,
        author: newBlog.author,
        category: newBlog.category,
        date: newBlog.date?.toISOString() || null,
        status: newBlog.deleted ? "Trash" : newBlog.status === "published" ? "Published" : "Draft",
        deleted: newBlog.deleted,
      });
    } catch (err) {
      console.error("[POST /api/blogs] Error:", err);
      return res.status(500).json({ error: "Failed to create blog" });
    }
  }

  // ─── Method Not Allowed ─────────────────────────────────────────
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
