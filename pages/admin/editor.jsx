// pages/admin/editor.jsx
import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

// ————————————————
// ONLY pull in ReactQuill on the client. This forces it into the main bundle
// and avoids any code‐split loader (require.e) or bad cleanup (destroy) issues.
// ————————————————
let ReactQuill = null
if (typeof window !== "undefined") {
  const quillPkg = require("react-quill")
  ReactQuill = quillPkg.default || quillPkg
  require("react-quill/dist/quill.snow.css")
}

export default function EditorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { edit } = router.query
  const isEditing = Boolean(edit)
  const quillRef = useRef()

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) router.replace("/admin/login")
  }, [user, router])

  // Form state
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Dominique",
    date: new Date().toISOString().split("T")[0],
    category: "",
    tags: "",
    image: "",
    ogImage: "",
    metaTitle: "",
    metaDescription: "",
    published: true,
  })
  const [preview, setPreview] = useState(null)
  const [loadingImage, setLoadingImage] = useState(false)
  const [saving, setSaving] = useState(false)

  // 1️⃣ Auto‐slug
  useEffect(() => {
    if (form.title && !isEditing) {
      const generated = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setForm((p) => ({ ...p, slug: generated }))
    }
  }, [form.title, isEditing])

  // 2️⃣ Load existing post when editing
  useEffect(() => {
    if (!isEditing) return
    api
      .get(`/api/blogs/${edit}`)
      .then((data) => {
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          author: data.author || "Dominique",
          date: data.date ? data.date.split("T")[0] : form.date,
          category: data.category || "",
          tags: (data.tags || []).join(", "),
          image: data.image || "",
          ogImage: data.image || "",
          metaTitle: data.metaTitle || data.title || "",
          metaDescription: data.metaDescription || data.excerpt || "",
          published: data.status === "published",
        })
        setPreview(data.image || null)
      })
      .catch(() => toast.error("Error loading blog"))
  }, [isEditing, edit])

  // Generic form handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // 3️⃣ Upload featured image
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setLoadingImage(true)

    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Upload failed")
      }
      const { url } = await res.json()
      setForm((p) => ({ ...p, image: url, ogImage: url }))
      toast.success("Image uploaded")
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    } finally {
      setLoadingImage(false)
    }
  }

  // 4️⃣ Save post
  const handleSubmit = async () => {
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        date: form.date,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        featuredImage: form.image,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        status: form.published ? "published" : "draft",
      }

      if (isEditing) {
        await api.put(`/api/blogs/${edit}`, payload)
        toast.success("Post updated")
      } else {
        await api.post("/api/blogs", payload)
        toast.success("Post created")
      }
      router.replace("/admin/blogs")
    } catch {
      toast.error("Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-sm rounded">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Blog Post" : "New Blog Post"}
      </h1>

      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border px-3 py-2 rounded"
        />
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="border px-3 py-2 rounded"
        />
        <input
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Excerpt"
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border px-3 py-2 rounded"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="border px-3 py-2 rounded"
        />
        <input
          name="metaTitle"
          value={form.metaTitle}
          onChange={handleChange}
          placeholder="Meta Title"
          className="border px-3 py-2 rounded md:col-span-2"
        />
        <input
          name="metaDescription"
          value={form.metaDescription}
          onChange={handleChange}
          placeholder="Meta Description"
          className="border px-3 py-2 rounded md:col-span-2"
        />
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />{" "}
          Published
        </label>
      </div>

      {/* Image upload */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loadingImage}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-60 h-40 object-cover rounded mt-4"
          />
        )}
      </div>

      {/* Rich text editor */}
      <div className="mb-8">
        {ReactQuill ? (
          <ReactQuill
            ref={quillRef}
            value={form.content}
            onChange={(v) => setForm((p) => ({ ...p, content: v }))}
            placeholder="Write your blog post..."
            className="bg-white rounded"
          />
        ) : (
          <p>Loading editor…</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-6 py-3 rounded text-white ${
            saving ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saving
            ? "Saving..."
            : isEditing
            ? "Update Post"
            : "Publish Post"}
        </button>
      </div>
    </div>
  )
}
