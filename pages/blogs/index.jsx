// pages/blogs/index.jsx
import React, { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import stripHtml from "@/utils/stripHtml"
import { useAuth } from "@/context/AuthContext"

// Prefix relative image paths if needed
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || ""

export default function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState(1)
  const postsPerPage = 6
  const { user } = useAuth()

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) =>
        setBlogs(
          data.map((p) => ({
            ...p,
            image: p.image.startsWith("http") ? p.image : API_ORIGIN + p.image,
            cleanContent: stripHtml(p.content || ""),
            author: p.author || "Anonymous",
            authorSlug:
              p.authorSlug ||
              (p.author || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            authorAvatar: p.authorAvatar || "",
          }))
        )
      )
      .catch(console.error)
  }, [])

  // ─── after your useEffect/fetch logic ───────────────────
  // Make a single array of posts (no filtering/search)
  const allPosts = blogs

  // Calculate pages
  const totalPages = Math.ceil(allPosts.length / postsPerPage)
  let hero, sidebarPosts = [], gridPosts = []
  if (page === 1) {
    hero = allPosts[0]
    sidebarPosts = allPosts.slice(1, 3)
    gridPosts = allPosts.slice(3)
  } else {
    const start = (page - 1) * postsPerPage
    gridPosts = byCategory.slice(start, start + postsPerPage)
  }

  const uniqueCategories = [
    "all",
    ...new Set(
      blogs.map((b) => (b.category || "uncategorized").toLowerCase())
    ),
  ]

  const readTime = (text) => Math.max(1, Math.round(text.split(" ").length / 200))

  if (blogs.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">Loading posts…</div>
    )
  }

  // Hashnode-style meta (avatar • name • read time • views)
  const renderMeta = (post) => (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      {post.authorAvatar ? (
        <img
          src={post.authorAvatar}
          alt={post.author}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-700 font-medium">
            {post.author.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span className="font-medium text-gray-700">{post.author}</span>
      <span>•</span>
      <span>⏱ {readTime(post.cleanContent)} min read</span>
      <span>•</span>
      <span>{post.views || 0} views</span>
    </div>
  )

  //Padding for Blog Page//
  return (
    <main className="py-28 pb-8 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">RentFAX Insights</h1>


      {/* Hero + Sidebar (page 1) */}
      {page === 1 && hero && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Link
            href={`/blogs/${hero.slug}`}
            className="group lg:col-span-2 block overflow-hidden rounded-lg bg-white transition-transform hover:scale-[1.01]"
          >
            {hero.image && (
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full h-80 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">
                {hero.title}
              </h2>
              <p className="text-gray-600 mb-6 line-clamp-3">
                {hero.excerpt
                  ? stripHtml(hero.excerpt)
                  : stripHtml(hero.content).slice(0, 200) + "…"}
              </p>
              {renderMeta(hero)}
            </div>
          </Link>

          <div className="space-y-8">
            {sidebarPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blogs/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg bg-white transition-transform hover:scale-[1.01]"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {stripHtml(p.excerpt)}
                  </p>
                  {renderMeta(p)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {gridPosts.map((p) => (
          <Link
            key={p.slug}
            href={`/blogs/${p.slug}`}
            className="group block overflow-hidden rounded-lg bg-white transition-transform hover:scale-[1.01]"
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <h4 className="text-xl font-semibold mb-2">{p.title}</h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {stripHtml(p.excerpt)}
              </p>
              {renderMeta(p)}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 border rounded ${
                p === page ? "bg-indigo-600 text-white" : "bg-white text-gray-800"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
