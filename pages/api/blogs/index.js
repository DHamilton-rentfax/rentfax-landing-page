import connectDB from "@/lib/mongodb";
import Blog from "@/models/Post";
import allowCors from "@/middleware/cors";

async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const showDeleted = req.query.deleted === "true";

      const query = showDeleted
        ? { deleted: true }
        : {
            $or: [{ deleted: false }, { deleted: { $exists: false } }],
            status: "published",
            title: { $exists: true, $ne: "" },
            content: { $exists: true, $ne: "" },
          };

      const blogs = await Blog.find(query).sort({ date: -1 }).lean();

      const posts = blogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        image: b.featuredImage || "",
        author: b.author || "Unknown",
        category: (b.category || "uncategorized").toLowerCase(),
        date: b.date?.toISOString() || null,
        status: b.deleted ? "Trash" : b.status === "published" ? "Published" : "Draft",
        deleted: !!b.deleted,
      }));

      return res.status(200).json({ success: true, posts });
    } catch (err) {
      console.error("[GET /api/blogs] Error:", err);
      return res.status(500).json({ success: false, error: "Failed to fetch blog posts." });
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

      if (!title?.trim() || !slug?.trim() || !content?.trim()) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: title, slug, or content.",
        });
      }

      const newBlog = new Blog({
        title: title.trim(),
        subtitle: subtitle.trim(),
        slug: slug.trim(),
        content: content.trim(),
        excerpt: excerpt?.trim() || "",
        featuredImage,
        tags,
        metaTitle: metaTitle?.trim() || title.trim(),
        metaDescription: metaDescription?.trim() || excerpt?.trim() || "",
        keywords: keywords.trim(),
        author: author.trim(),
        category: category.trim().toLowerCase(),
        status,
        date,
        deleted: false,
      });

      await newBlog.save();

      return res.status(201).json({
        success: true,
        post: {
          slug: newBlog.slug,
          title: newBlog.title,
          excerpt: newBlog.excerpt,
          image: newBlog.featuredImage,
          author: newBlog.author,
          category: newBlog.category,
          date: newBlog.date?.toISOString() || null,
          status: newBlog.status === "published" ? "Published" : "Draft",
          deleted: false,
        },
      });
    } catch (err) {
      console.error("[POST /api/blogs] Error:", err);
      return res.status(500).json({ success: false, error: "Failed to create blog post." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed.`,
    allowed: ["GET", "POST"],
  });
}

export default allowCors(handler);
