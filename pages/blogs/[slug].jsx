// pages/blogs/[slug].jsx
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import parse from "html-react-parser"
import Link from "next/link"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query

  const [post, setPost] = useState(null)
  const [views, setViews] = useState(0)
  const [weeklyViews, setWeeklyViews] = useState([])
  const [related, setRelated] = useState([])
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState("")
  const [error, setError] = useState(null)

  // Fetch post data
  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`)
        if (!res.ok) throw new Error(`Blog not found (${res.status})`)
        const data = await res.json()
        console.log("🔍 [slug page] post:", data)
        setPost(data)

        setViews(data.views || 0)
        const recent = Object.entries(data.viewsByDate || {})
          .slice(-7)
          .map(([date, count]) => ({ date, count }))
        setWeeklyViews(recent)

        // fetch related posts
        const rel = await fetch(`/api/blogs/related`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tags: data.tags || [] }),
        }).then((r) => r.json())
        setRelated(rel)

        // fetch comments
        const comm = await fetch(`/api/comments/${slug}`).then((r) => r.json())
        setComments(comm)
      } catch (err) {
        console.error(err)
        setError("Sorry, this blog post could not be found.")
      }
    }
    fetchPost()
  }, [slug])

  const submitComment = async () => {
    const text = commentInput.trim()
    if (!text || comments.some((c) => c.text.trim() === text)) return
    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const newComment = await res.json()
      setComments((curr) => [...curr, newComment])
      setCommentInput("")
    } catch (err) {
      console.error("Error submitting comment", err)
    }
  }

  const estimateReadTime = (text) => {
    const words = text.split(" ").length
    return Math.max(1, Math.round(words / 200))
  }

  // Chart config
  const chartData = {
    labels: weeklyViews.map((v) => v.date),
    datasets: [
      {
        label: "Views",
        data: weeklyViews.map((v) => v.count),
        borderRadius: 4,
      },
    ],
  }
  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  }

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        {error}
      </div>
    )
  if (!post) return <div className="p-6 text-center">Loading…</div>

  return (
    <>
      <Head>
        <title>{post.metaTitle || post.title} – RentFAX Blog</title>
        {post.metaDescription && (
          <meta name="description" content={post.metaDescription} />
        )}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.image && <meta property="og:image" content={post.image} />}
      </Head>

      <section className="container mx-auto px-4 py-12 bg-white antialiased">
        <div className="max-w-3xl mx-auto">
          {/* Featured Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover rounded-lg mb-8 shadow-md"
            />
          )}

          {/* Title & Excerpt */}
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-xl text-gray-600 mb-4">{post.subtitle}</h2>
          )}
          {post.excerpt && <p className="text-gray-600 mb-6">{post.excerpt}</p>}

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-10">
            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">
              {post.author?.[0]?.toUpperCase() || "?"}
            </div>
            <span>{post.author || "Admin"}</span>
            <span>•</span>
            <span>
              {new Date(post.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{estimateReadTime(post.content)} min read</span>
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none mb-8">
            {parse(post.content)}
          </article>

          {/* Views & Chart */}
          <div className="mt-8 pt-4 text-sm text-gray-500 border-t">
            {views} views • Last updated{' '}
            {new Date(post.updatedAt || post.date).toLocaleDateString()}
          </div>
          {weeklyViews.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Traffic (Last 7 Days)</h4>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          {/* Comments */}
          <div className="mt-16 border-t pt-10">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            {comments.length > 0 ? (
              <div className="space-y-4 mb-6">
                {comments.map((c, i) => (
                  <div key={i} className="border-b pb-2 text-sm text-gray-800 flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                      {c.name?.[0]?.toUpperCase() || "🗣️"}
                    </div>
                    <div>
                      <p>{c.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(c.date || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6">No comments yet.</p>
            )}
            <textarea
              className="w-full border px-4 py-2 rounded mb-2"
              placeholder="Leave a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              onClick={submitComment}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Post Comment
            </button>
          </div>

          {/* Related Posts */}
          <div className="mt-16 border-t pt-10">
            <h3 className="text-xl font-semibold mb-6">Related Posts</h3>
            {related.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    href={`/blogs/${r.slug}`}
                    key={r._id}
                    className="block p-4 border rounded hover:shadow-md transition"
                  >
                    <h4 className="font-semibold text-lg mb-2">
                      {r.title}
                    </h4>
                    <p className="text-sm text-gray-600">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No related posts found.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
