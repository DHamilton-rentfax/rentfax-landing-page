// pages/admin/analytics.jsx
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/context/AuthContext"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Analytics() {
  const { user } = useAuth()
  const router = useRouter()
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    if (!user) return router.push("/admin/login")

    fetch("/api/auth/blogs")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res?.posts)) {
          setBlogs(res.posts)
        } else {
          console.warn("Unexpected blog format:", res)
          setBlogs([])
        }
      })
      .catch((err) => {
        console.error("Failed to load blogs", err)
        setBlogs([])
      })
  }, [user])

  const totalPosts = blogs.length
  const publishedCount = blogs.filter((b) => (b.status || "").toLowerCase() === "published").length
  const draftCount = totalPosts - publishedCount
  const viewTotals = blogs.reduce((sum, b) => sum + (b.views || 0), 0)

  const mostViewed = blogs.reduce(
    (top, b) => (!top || (b.views || 0) > (top.views || 0) ? b : top),
    null
  )

  const labelsByPost = blogs.map((b) => (b.title || "Untitled").slice(0, 15) + "…")
  const viewsByPost = blogs.map((b) => b.views || 0)

  const viewCountsByDate = blogs.reduce((acc, b) => {
    const day = b.date ? new Date(b.date).toLocaleDateString() : "Unknown"
    acc[day] = (acc[day] || 0) + (b.views || 0)
    return acc
  }, {})

  const dateLabels = Object.keys(viewCountsByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  )
  const viewsByDate = dateLabels.map((d) => viewCountsByDate[d])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="text-indigo-600 text-3xl mr-4">📝</div>
          <div>
            <p className="text-sm text-gray-500">Total Posts</p>
            <p className="text-xl font-semibold">{totalPosts}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="text-green-500 text-3xl mr-4">✅</div>
          <div>
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-xl font-semibold">{publishedCount}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="text-yellow-500 text-3xl mr-4">🗒️</div>
          <div>
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-xl font-semibold">{draftCount}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="text-red-500 text-3xl mr-4">🔥</div>
          <div>
            <p className="text-sm text-gray-500">Most Viewed</p>
            <p className="text-xl font-semibold">
              {mostViewed ? mostViewed.title.slice(0, 20) + "…" : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Views per Post</h2>
          <Bar
            data={{
              labels: labelsByPost,
              datasets: [
                {
                  label: "Views",
                  data: viewsByPost,
                  backgroundColor: "rgba(59,130,246,0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Views by Date (Last 30d)</h2>
          <Bar
            data={{
              labels: dateLabels,
              datasets: [
                {
                  label: "Daily Views",
                  data: viewsByDate,
                  backgroundColor: "rgba(16,185,129,0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </div>
    </div>
  )
}
