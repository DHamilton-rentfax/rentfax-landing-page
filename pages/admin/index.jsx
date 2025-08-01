import React from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "@/components/ProtectRoute";

function AdminDashboardContent() {
  const { user, logout } = useAuth();

  console.log("✅ Dashboard rendered | Logged in user:", user);

  const displayName = user?.fullName || user?.email || "Admin";

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt={`${displayName}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <h1 className="text-3xl sm:text-4xl font-bold">
              Welcome, {displayName}
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        {/* Quick Links */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/analytics"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <p className="text-xl font-semibold mb-2">Analytics</p>
            <p className="text-gray-500">View post & traffic stats</p>
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin/approvals"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="text-xl font-semibold mb-2">Approve Editors</p>
              <p className="text-gray-500">Authorize new editor accounts</p>
            </Link>
          )}

          <Link
            href="/admin/blogs"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <p className="text-xl font-semibold mb-2">Manage Posts</p>
            <p className="text-gray-500">Edit, create, or delete blog posts</p>
          </Link>

          <Link
            href="/editor-register"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <p className="text-xl font-semibold mb-2">Register Editor</p>
            <p className="text-gray-500">Invite someone to become an editor</p>
          </Link>
        </section>

        {/* Recent Activity */}
        <section className="mt-10 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-gray-700">
            <li>✅ Blog post published: “How to Screen Renters”</li>
            <li>👤 New editor registered: editor@example.com</li>
            <li>📝 Comment approved on: “Fraud Prevention Tips”</li>
          </ul>
        </section>

      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
