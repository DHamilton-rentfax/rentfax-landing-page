// pages/blogs/[slug].jsx
import React, { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import parse from "html-react-parser"
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

export async function getServerSideProps({ params, req }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || `http://${req.headers.host}`
  const res = await fetch(`${baseUrl}/api/blogs/${params.slug}`)
  if (!res.ok) return { notFound: true }
  const post = await res.json()
  return { props: { post } }
}

export default function BlogPost({ post }) {
  const [related, setRelated] = useState([])
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState("")

  useEffect(() => {
    // Fetch related posts
    fetch("/api/blogs/related", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: post.tags || [] }),
    })
      .then((r) => r.json())
      .then(setRelated)
      .catch(console.error)

    // Fetch comments
    fetch(`/api/comments/${post.slug}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(console.error)
  }, [post.slug, post.tags])

  const submitComment = async () => {
    const text = commentInput.trim()
    if (!text || comments.some((c) => c.text.trim() === text)) return
    try {
      const res = await fetch(`/api/comments/${post.slug}`, {
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

  const estimateReadTime = (text) =>
    Math.max(1, Math.round(text.split(" ").length / 200))

  const weeklyViews = Object.entries(post.viewsByDate || {})
    .slice(-7)
    .map(([date, count]) => ({ date, count }))
  const chartData = {
    labels: weeklyViews.map((v) => v.date),
    datasets: [{ data: weeklyViews.map((v) => v.count), borderRadius: 4 }],
  }
  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  }

  return (
    <>
      <Head>
        <title>{post.metaTitle || post.title} – RentFAX Blog</title>
        {post.metaDescription && (
          <meta name="description" content={post.metaDescription} />
        )}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featuredImage && (
          <meta property="og:image" content={post.featuredImage} />
        )}
      </Head>

      <section className="container mx-auto px-4 py-12 bg-white antialiased">
        <div className="max-w-3xl mx-auto">
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover rounded-lg mb-8 shadow-md"
            />
          )}

          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-xl text-gray-600 mb-4">{post.subtitle}</h2>
          )}
          {post.excerpt && (
            <p className="text-gray-600 mb-6">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-10">
            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">
              {post.author?.[0]?.toUpperCase() || "?"}
            </div>
            <Link
              href={`/authors/${post.authorSlug || post.author}`}
              className="font-medium text-gray-700 hover:underline"
            >
              {post.author || "Admin"}
            </Link>
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

          <article className="prose prose-lg max-w-none mb-8">
            {parse(post.content)}
          </article>

          <div className="mt-8 pt-4 text-sm text-gray-500 border-t">
            {post.views || 0} views • Last updated{" "}
            {new Date(post.updatedAt || post.date).toLocaleDateString()}
          </div>
          {weeklyViews.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Traffic (Last 7 Days)
              </h4>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          {/* Comments */}
          <div className="mt-16 border-t pt-10">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            {comments.length > 0 ? (
              comments.map((c, i) => (
                <div
                  key={i}
                  className="border-b pb-2 text-sm text-gray-800 flex items-start gap-3 mb-4"
                >
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
              ))
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
                    <h4 className="font-semibold text-lg mb-2">{r.title}</h4>
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
