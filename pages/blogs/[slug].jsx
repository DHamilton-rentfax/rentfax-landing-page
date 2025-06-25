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
import CommentSection from "@/components/CommentSection"
import ViewCounter from "@/components/ViewCounter"

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

  useEffect(() => {
    fetch("/api/blogs/related", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: post.tags || [] }),
    })
      .then((r) => r.json())
      .then(setRelated)
      .catch(console.error)
  }, [post.tags])

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

      <section className="container mx-auto px-4 pt-24 pb-12 bg-white antialiased">
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

          <div className="mt-4 mb-6 text-sm text-gray-500">
            <ViewCounter postId={post._id} />
            <span className="ml-2">
              Last updated {" "}
              {new Date(post.updatedAt || post.date).toLocaleDateString()}
            </span>
          </div>

          {weeklyViews.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Traffic (Last 7 Days)
              </h4>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          <div className="mt-16 border-t pt-10">
            <CommentSection postId={post._id} />
          </div>

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
