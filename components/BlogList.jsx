// components/BlogList.jsx
import Link from "next/link"

export default function BlogList({ blogs = [] }) {
  if (!blogs.length) return <p className="text-center text-gray-500">No blog posts available.</p>

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {blogs.map((post) => (
        <div key={post.slug} className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold text-indigo-700 mb-2 hover:underline">{post.title}</h3>
          </Link>
          <p className="text-gray-600 text-sm mb-2">{new Date(post.date).toLocaleDateString()}</p>
          <p className="text-gray-700">{post.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
