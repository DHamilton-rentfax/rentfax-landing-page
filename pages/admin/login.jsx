// pages/admin/login.jsx
import React, { useState } from "react"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

export default function AdminLogin() {
  const router = useRouter()
  const { login, loading: authLoading } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(form.email, form.password)
    if (!success) {
      setLoading(false)
      return
    }
    // on success, your AuthContext will redirect you to /admin/blogs
  }

  return (
    // 1) Full‐width & full‐height container with your gradient background
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
      {/* 2) Centered card with a max-width */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Admin Login
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Sign in to manage blog posts
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@rentfax.io"
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md transition ${
              loading || authLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading || authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
