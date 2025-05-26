// pages/admin/login.jsx
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(form.email, form.password);
    if (!success) {
      setLoading(false);
      toast.error("Invalid credentials or account pending approval");
      return;
    }
    // on success, AuthContext will redirect you to /admin/blogs
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Editor Login
        </h2>
        <p className="text-center text-gray-500">
          Sign in to manage blog posts
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@rentfax.io"
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Password with toggle */}
            <div className="space-y-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="mt-1 w-full px-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                /* eye-off icon */
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10
                           a9.959 9.959 0 011.175-4.875M6.675 6.675a10.05 10.05 0 011.125-1.125M15
                           15l6-6m-2.122 2.122a10.05 10.05 0 01-1.125 1.125M9 9l-6 6" />
                </svg>
              ) : (
                /* eye icon */
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12
                           5c4.478 0 8.269 2.943 9.542 7
                           -1.273 4.057-5.064 7-9.542 7
                           -4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading || authLoading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md transition ${
              loading || authLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading || authLoading ? "Logging in…" : "Login"}
          </button>
        </form>

        {/* Register & Forgot */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/editor-register" className="text-indigo-600 hover:underline">
            Register as Editor
          </Link>
        </p>
        <p className="text-center text-sm">
          <Link href="/forgot-password" className="text-gray-500 hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
