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
      // login() already shows toast.error
      setLoading(false)
      return
    }

    // On success, login() called router.replace("/admin/blogs")
    // No further action needed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Admin Login
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
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
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
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
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded-md transition ${
              loading || authLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={loading || authLoading}
          >
            {loading || authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
