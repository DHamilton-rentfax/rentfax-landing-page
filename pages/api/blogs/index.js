// pages/api/blogs/index.js
import connectDB from "@/lib/mongodb"
import Blog from "@/models/Blog"

export default async function handler(req, res) {
  await connectDB()

  if (req.method === "GET") {
    try {
      // Fetch all non-deleted blogs and convert to plain JS objects
      const blogs = await Blog.find({ deleted: false }).sort({ date: -1 }).lean()

      // Map `featuredImage` into `image` for front-end convenience
      const adapted = blogs.map((b) => ({
        ...b,
        image: b.featuredImage || "",
      }))

      res.status(200).json(adapted)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to fetch blogs" })
    }
  } else if (req.method === "POST") {
    try {
      const newBlog = new Blog(req.body)
      await newBlog.save()
      res.status(201).json(newBlog)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to create blog" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
