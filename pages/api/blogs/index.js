import connectDB from "@/lib/mongodb";
import Blog from "@/models/Post";
import allowCors from "@/middleware/cors";

async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const showDeleted = req.query?.deleted === "true";

      const query = showDeleted
        ? { deleted: true }
        : {
            $or: [{ deleted: false }, { deleted: { $exists: false } }],
            status: "published",
            title: { $exists: true, $ne: "" },
            content: { $exists: true, $ne: "" },
          };

      const blogs = await Blog.find(query).sort({ createdAt: -1 }).lean();

      const posts = blogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt || "",
        image: b.featuredImage || "",
        author: b.author || "Unknown",
        category: (b.category || "uncategorized").toLowerCase(),
        date: b.createdAt?.toISOString() || null,
        status: b.deleted ? "Trash" : b.status === "published" ? "Published" : "Draft",
        deleted: !!b.deleted,
      }));

      return res.status(200).json({ success: true, posts });
    } catch (err) {
      console.error("[GET /api/blogs] Error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch blog posts.",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        title = "",
        slug = "",
        content = "",
        excerpt = "",
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

      const trimmedSlug = slug.trim().toLowerCase();
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (!trimmedTitle || !trimmedSlug || !trimmedContent) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: title, slug, or content.",
        });
      }

      // 🔒 Ensure unique slug
      const existing = await Blog.findOne({ slug: trimmedSlug });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: "Slug already exists. Please choose a unique slug.",
        });
      }

      const newBlog = new Blog({
        title: trimmedTitle,
        subtitle: subtitle?.trim() || "",
        slug: trimmedSlug,
        content: trimmedContent,
        excerpt: excerpt?.trim() || "",
        featuredImage,
        tags,
        metaTitle: metaTitle?.trim() || trimmedTitle,
        metaDescription: metaDescription?.trim() || excerpt?.trim() || "",
        keywords: keywords?.trim() || "",
        author: author?.trim() || "Admin",
        category: category?.trim().toLowerCase() || "uncategorized",
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
          date: newBlog.createdAt?.toISOString() || null,
          status: newBlog.status === "published" ? "Published" : "Draft",
          deleted: false,
        },
      });
    } catch (err) {
      console.error("[POST /api/blogs] Error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to create blog post.",
      });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed.`,
    allowed: ["GET", "POST"],
  });
}

export default allowCors(handler);
