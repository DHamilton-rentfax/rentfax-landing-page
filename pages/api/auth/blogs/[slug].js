// pages/api/auth/blogs/[slug].js
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Post";

export default async function handler(req, res) {
  await connectDB();

  const { slug } = req.query;

  try {
    const blog = await Blog.findOne({
      slug: slug.trim(),
      status: { $regex: /^published$/i },
      deleted: { $ne: true },
    })
      .populate("author", "fullName email avatar bio")
      .lean();

    if (!blog) {
      console.warn("[BLOG] Not found:", slug);
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    const authorName =
      blog.author?.fullName || blog.author?.email || blog.authorName || "Unknown";

    res.status(200).json({
      success: true,
      post: {
        _id: blog._id.toString(),
        slug: blog.slug,
        title: blog.title,
        subtitle: blog.subtitle || "",
        content: blog.content,
        excerpt: blog.excerpt || "",
        image: blog.featuredImage || blog.image || "",
        author: authorName,
        authorName,
        authorAvatar: blog.author?.avatar || "",
        authorBio: blog.author?.bio || "",
        category: blog.category || "",
        date: blog.date?.toISOString() || blog.createdAt?.toISOString() || null,
        views: blog.views || 0,
        viewsByDate: blog.viewsByDate || {},
      },
    });
  } catch (err) {
    console.error("[BLOG ERROR]", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
