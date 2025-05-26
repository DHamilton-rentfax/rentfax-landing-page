// pages/admin/blogs.jsx
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import api from "@/lib/api"
import ConfirmModal from "@/components/ConfirmModal"
import { useAuth } from "../../context/AuthContext"

export default function AdminBlogs() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // all posts (including soft-deleted)
  const [blogs, setBlogs] = useState([])
  // filtered view
  const [filtered, setFiltered] = useState([])
  // simple UI filters
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  // pagination
  const [page, setPage] = useState(1)
  const limit = 10

  // trash toggle + modal
  const [showTrash, setShowTrash] = useState(false)
  const [modalSlug, setModalSlug] = useState(null)

  // 1️⃣ Load everything on mount
  useEffect(() => {
    if (!user) return router.replace("/admin/login")
    api
      .get("/api/auth/blogs")
      .then((data) => {
        setBlogs(data)
      })
      .catch(() => toast.error("Failed to load posts"))
  }, [user])

  // 2️⃣ Whenever blogs or any filter changes, re-compute filtered list
  useEffect(() => {
    let list = blogs.filter((b) => (showTrash ? b.deleted : !b.deleted))

    if (search.trim()) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (category !== "all") {
      list = list.filter((p) => (p.category || "uncategorized") === category)
    }
    if (status !== "all") {
      list = list.filter((p) => (p.status || "published") === status)
    }

    setFiltered(list)
    setPage(1)
  }, [blogs, showTrash, search, category, status])

  // pagination
  const totalPages = Math.ceil(filtered.length / limit)
  const paginated = filtered.slice((page - 1) * limit, page * limit)

  const handleEdit = (slug) => {
    router.push(`/admin/editor?edit=${slug}`)
  }

  // 4️⃣ Soft-delete or permanent delete
  const confirmDelete = (slug) => setModalSlug(slug)
  const handleDelete = async () => {
    try {
      // if viewing trash, this is permanent delete
      const url = showTrash
        ? `/api/blogs/${modalSlug}?action=destroy`
        : `/api/blogs/${modalSlug}`
      await api.delete(url)
      toast.success(showTrash ? "Deleted permanently" : "Moved to trash")
      setBlogs((b) =>
        showTrash
          ? b.filter((x) => x.slug !== modalSlug)
          : b.map((x) =>
              x.slug === modalSlug ? { ...x, deleted: true } : x
            )
      )
    } catch {
      toast.error("Action failed")
    } finally {
      setModalSlug(null)
    }
  }

  // 5️⃣ Restore
  const handleRestore = async (slug) => {
    try {
      await api.patch(`/api/blogs/${slug}?action=restore`)
      toast.success("Restored post")
      setBlogs((b) =>
        b.map((x) => (x.slug === slug ? { ...x, deleted: false } : x))
      )
    } catch {
      toast.error("Restore failed")
    }
  }

  // dropdown options
  const categories = [
    "all",
    ...new Set(blogs.map((b) => b.category || "uncategorized")),
  ]
  const statuses = ["all", "published", "draft"]

  return (
    <div className="w-full max-w-[90vw] mx-auto px-8 py-8">
      {/* ─ Title & Live/Trash toggle ────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Blog Manager</h1>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showTrash}
            onChange={() => setShowTrash((v) => !v)}
            className="form-checkbox"
          />
          {showTrash ? "Viewing Trash" : "Viewing Live"}
        </label>
      </div>

      {/* ─ Filters & Actions ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border px-4 py-2 rounded"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/editor"
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded shadow"
          >
            + New Post
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded shadow"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ─ Posts Table ───────────────────────────────────────────── */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Title",
                "Date",
                "Author",
                "Category",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 border text-left whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((b) => (
              <tr key={b.slug} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{b.title}</td>
                <td className="px-4 py-2 border">
                  {new Date(b.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{b.author}</td>
                <td className="px-4 py-2 border">
                  {b.category || "—"}
                </td>
                <td className="px-4 py-2 border capitalize">
                  {b.status}
                </td>
                <td className="px-4 py-2 border text-center">
                  <div className="inline-flex items-center space-x-2">
                    {!showTrash ? (
                      <>
                        <button
                          onClick={() => handleEdit(b.slug)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={() => confirmDelete(b.slug)}
                          className="text-red-600 hover:underline"
                        >
                          Trash
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRestore(b.slug)}
                          className="text-green-600 hover:underline"
                        >
                          Restore
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={() => confirmDelete(b.slug)}
                          className="text-red-600 hover:underline"
                        >
                          Delete Permanently
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─ Pagination ────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${
                  p === page
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      )}

      {/* ─ Confirm Modal ─────────────────────────────────────────── */}
      <ConfirmModal
        open={!!modalSlug}
        title={
          showTrash
            ? "Delete Permanently?"
            : "Move to Trash?"
        }
        message={
          showTrash
            ? "This will permanently delete the post. Are you sure?"
            : "The post will be moved to Trash. You can restore it later."
        }
        onConfirm={handleDelete}
        onCancel={() => setModalSlug(null)}
      />
    </div>
  )
}
