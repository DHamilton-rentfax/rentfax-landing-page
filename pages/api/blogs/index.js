// pages/api/blogs/index.js
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Post";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const showDeleted = req.query.deleted === "true";

      const query = showDeleted
        ? { deleted: true }
        : {
            $or: [{ deleted: false }, { deleted: { $exists: false } }],
            status: "published",
          };

      const blogs = await Blog.find(query).sort({ date: -1 }).lean();

      console.log("✅ Blogs fetched:", blogs); // DEBUG

      const adapted = blogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        image: b.featuredImage || "",
        author: b.author,
        category: b.category || "",
        date: b.date?.toISOString() || null,
        status: b.deleted ? "Trash" : b.status === "published" ? "Published" : "Draft",
        deleted: !!b.deleted,
      }));

      return res.status(200).json(adapted);
    } catch (err) {
      console.error("[GET /api/blogs] Error:", err);
      return res.status(500).json({ error: "Failed to fetch blogs" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        featuredImage = "",
        subtitle = "",
        tags = [],
        metaTitle,
        metaDescription,
        keywords = "",
        author = "Admin",
        category = "uncategorized",
        status = "draft",
        date = new Date(),
      } = req.body;

      if (!title || !slug || !content) {
        return res.status(400).json({ error: "Missing required fields: title, slug, or content." });
      }

      const newBlog = new Blog({
        title,
        subtitle,
        slug,
        content,
        excerpt,
        featuredImage,
        tags,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        keywords,
        author,
        category,
        status,
        date,
        deleted: false,
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
        status: newBlog.status === "published" ? "Published" : "Draft",
        deleted: false,
      });
    } catch (err) {
      console.error("[POST /api/blogs] Error:", err);
      return res.status(500).json({ error: "Failed to create blog" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
