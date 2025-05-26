// components/BlogEditor.jsx
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useState, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import api from "../lib/api"
import { useRouter } from "next/router"
import slugify from "slugify"

export default function BlogEditor({ post, setPost }) {
  const router = useRouter()
  const { slug: routeSlug } = router.query
  const isEdit = Boolean(routeSlug)

  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [imagePreview, setImagePreview] = useState(post.featuredImage || "")
  const saveTimeout = useRef(null)

  // ── Tiptap setup ─────────────────────────────────────────────
  const editor = useEditor({
    extensions: [StarterKit],
    content: post.content || "",
    onUpdate({ editor }) {
      setPost((prev) => ({ ...prev, content: editor.getHTML() }))
    },
  })

  // ── Auto‐save draft after 3s inactivity ───────────────────────
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => handleSave(true, true), 3000)
    return () => {
      clearTimeout(saveTimeout.current)
    }
  }, [post])

  // ── Save (POST for new, PUT for edit) ─────────────────────────
  const handleSave = async (isDraft = false, isAuto = false) => {
    if (!post.title || !post.content) return

    setLoading(true)
    const newSlug = slugify(post.title, { lower: true, strict: true })
    const payload = {
      ...post,
      slug: newSlug,
      status: isDraft ? "draft" : "published",
      date: new Date().toISOString(),
    }

    try {
      let data
      if (isEdit) {
        // UPDATE existing
        const res = await api.put(`/api/blogs/${routeSlug}`, payload)
        data = await res.json()
      } else {
        // CREATE new
        const res = await api.post("/api/blogs", payload)
        data = await res.json()

        // switch into edit‐mode
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, slug: data.slug },
        })
      }

      setPost((p) => ({ ...p, ...data }))

      if (!isAuto) {
        toast.success(isDraft ? "Draft saved!" : "Published!")
        if (!isDraft && !isEdit) {
          router.push(`/blogs/${data.slug}`)
        }
      }
    } catch (err) {
      console.error("Save error:", err)
      if (!isAuto) toast.error("Save failed")
    } finally {
      setLoading(false)
    }
  }

  // ── Tag handling ───────────────────────────────────────────────
  const handleTagAdd = () => {
    const t = tagInput.trim()
    if (t && !post.tags.includes(t)) {
      setPost({ ...post, tags: [...post.tags, t] })
      setTagInput("")
    }
  }

  // ── Image upload ──────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()

      setPost((prev) => ({ ...prev, featuredImage: data.url }))
      setImagePreview(data.url)
      toast.success("Image uploaded")
    } catch (err) {
      console.error(err)
      toast.error("Upload failed")
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="px-4 py-2 border rounded"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
        <button
          onClick={() => handleSave(true)}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : isEdit ? "Update" : "Publish"}
        </button>
      </div>

      {/* Title, Slug, Excerpt, Category */}
      <input
        placeholder="Title"
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
        className="w-full text-3xl font-bold border rounded px-3 py-2"
      />
      <input
        placeholder="Slug (auto)"
        value={post.slug || ""}
        readOnly
        className="w-full mb-2 border rounded px-3 py-2 bg-gray-100"
      />
      <input
        placeholder="Excerpt"
        value={post.excerpt || ""}
        onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
      <input
        placeholder="Category"
        value={post.category || ""}
        onChange={(e) => setPost({ ...post, category: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />

      {/* Featured Image */}
      <label className="block font-medium">Featured Image</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full max-h-64 object-cover rounded mt-2"
        />
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags.map((t, i) => (
          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {t}
          </span>
        ))}
        <input
          placeholder="Add tag + Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTagAdd()}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Editor / Preview */}
      {!showPreview ? (
        editor ? (
          <EditorContent
            editor={editor}
            className="border p-4 rounded min-h-[300px]"
          />
        ) : (
          <p>Loading editor…</p>
        )
      ) : (
        <div className="prose border p-4 rounded">
          <h1>{post.title}</h1>
          {post.excerpt && <p className="italic">{post.excerpt}</p>}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      )}
    </div>
  )
}
