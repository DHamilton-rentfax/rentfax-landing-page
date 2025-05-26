// pages/admin/index.jsx
import React from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "@/components/ProtectRoute";

function AdminDashboardContent() {
  const { user, logout } = useAuth();

function AdminDashboardContent() {
  const { user, logout } = useAuth();
  console.log("Dashboard rendered, user:", user);
    // …
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Welcome, {user?.email}</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {/* Quick-links grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/analytics"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <p className="text-xl font-semibold mb-2">Analytics</p>
            <p className="text-gray-500">View post & traffic stats</p>
          </Link>

          <Link
            href="/admin/approvals"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <p className="text-xl font-semibold mb-2">Approve Editors</p>
            <p className="text-gray-500">Authorize new editor accounts</p>
          </Link>

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

          {/* Add more cards here as you build new features */}
        </section>
      </div>
    </main>
  );
}

// Wrap the content in ProtectedRoute so hooks inside it run in a valid React tree
export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
