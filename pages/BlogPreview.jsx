// pages/BlogPreview.jsx
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

export default function BlogPreview() {
  const router = useRouter()
  const { slug } = router.query
  const [blog, setBlog] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      try {
        const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`)
        if (!res.ok) throw new Error(`Blog not found (${res.status})`)
        const data = await res.json()
        setBlog(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }
    })()
  }, [slug])

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  if (!blog) {
    return <div className="p-8 text-center">Loading…</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>

      <div className="text-gray-600 mb-4">
        By{" "}
        <Link href={`/authors/${blog.authorSlug || blog.author}`}>
          <span className="font-medium text-indigo-600 hover:underline cursor-pointer">
            {blog.author}
          </span>
        </Link>{" "}
        •{" "}
        {new Date(blog.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        • {blog.status}
      </div>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full rounded-lg mb-6 object-cover"
        />
      )}

      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  )
}