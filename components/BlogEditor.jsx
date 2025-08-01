import {
  EditorContent,
  useEditor,
  BubbleMenu
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import History from "@tiptap/extension-history"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
import Link from "@tiptap/extension-link"
import CharacterCount from "@tiptap/extension-character-count"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { lowlight } from "lowlight"
import { useState, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import api from "../lib/api"
import { useRouter } from "next/router"
import slugify from "slugify"
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"
import { ResizableImage } from "@/components/extensions/ResizableImage"
import { Twitter } from "@tiptap/extension-twitter"
import { useAuth } from "@/context/AuthContext"

export default function BlogEditor({ post, setPost }) {
  const { user } = useAuth()
  const router = useRouter()
  const { slug: routeSlug } = router.query
  const isEdit = Boolean(routeSlug)

  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [imagePreview, setImagePreview] = useState(post.featuredImage || "")
  const [lastSaved, setLastSaved] = useState(null)
  const saveTimeout = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      History,
      Placeholder.configure({ placeholder: "Start writing here..." }),
      Image.configure({ inline: false }),
      ResizableImage,
      Youtube.configure({
        HTMLAttributes: { class: "youtube-video" },
        width: 640,
        height: 360,
      }),
      Link.configure({ openOnClick: false }),
      CharacterCount.configure({ limit: 5000 }),
      CodeBlockLowlight.configure({ lowlight }),
      Twitter.configure(),
    ],
    content: post.content || "",
    onUpdate({ editor }) {
      const html = editor.getHTML()
      const wordCount = editor.getText().split(/\s+/).filter(Boolean).length
      setPost((prev) => ({ ...prev, content: html, wordCount }))
      localStorage.setItem("autosave-draft", html)
    },
  })

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => handleSave(true, true), 3000)
    return () => clearTimeout(saveTimeout.current)
  }, [post])

  useEffect(() => {
    const draft = localStorage.getItem("autosave-draft")
    if (draft && !post.content) {
      setPost((prev) => ({ ...prev, content: draft }))
      toast.success("Restored autosave draft")
    }
  }, [])

  const handleSave = async (isDraft = false, isAuto = false) => {
    if (!post.title || !post.content) return

    setLoading(true)
    const newSlug = slugify(post.title, { lower: true, strict: true })

    const payload = {
      ...post,
      slug: newSlug,
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || post.excerpt || "",
      keywords: post.keywords || "",
      status: isDraft ? "draft" : "published",
      date: new Date().toISOString(),
      author: post.author || (user && user._id),
      authorName: post.authorName || (user && (user.fullName || user.email)),
    }

    try {
      const res = isEdit
        ? await api.put(`/api/blogs/${routeSlug}`, payload)
        : await api.post("/api/blogs", payload)

      const data = await res.json()
      if (!data.success) throw new Error("Save failed")

      const savedPost = data.blog || data.post || {}
      setPost((prev) => ({ ...prev, ...savedPost, slug: savedPost.slug }))
      setImagePreview(savedPost.featuredImage || "")
      setLastSaved(new Date())

      if (!isAuto) toast.success(isDraft ? "Draft saved!" : "Published!")
      if (!isDraft && !isEdit) router.push(`/blogs/${savedPost.slug}`)
    } catch (err) {
      console.error("Save error:", err)
      if (!isAuto) toast.error("Save failed")
    } finally {
      setLoading(false)
    }
  }

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

  const handleTagAdd = () => {
    const t = tagInput.trim()
    if (t && !(post.tags || []).includes(t)) {
      setPost({ ...post, tags: [...(post.tags || []), t] })
      setTagInput("")
    }
  }

  const handleDuplicate = async () => {
    const res = await api.post("/api/blogs", {
      ...post,
      slug: slugify(`${post.title} copy`, { lower: true, strict: true }),
      title: `${post.title} (Copy)` || "Untitled",
      status: "draft",
    })
    const data = await res.json()
    toast.success("Post duplicated")
    router.push(`/admin/editor?slug=${data.slug}`)
  }

  const formatLastSaved = () => {
    if (!lastSaved) return ""
    const diff = Math.floor((Date.now() - new Date(lastSaved).getTime()) / 1000)
    if (diff < 60) return `Last saved just now`
    if (diff < 3600) return `Last saved ${Math.floor(diff / 60)} min ago`
    return `Last saved over an hour ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 italic">
          {post.authorName && <p>Author: {post.authorName}</p>}
          {post.slug && <p>Slug: {post.slug}</p>}
        </div>
        <div className="text-xs text-gray-400">{formatLastSaved()}</div>
      </div>

      <input
        type="text"
        value={post.title || ""}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
        placeholder="Title"
        className="text-3xl font-bold w-full border-b border-gray-300 focus:outline-none"
      />

      <textarea
        value={post.excerpt || ""}
        onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
        placeholder="Short excerpt..."
        className="w-full p-2 border rounded text-sm"
      />

      <EditorContent editor={editor} className="prose max-w-full" />

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview && <img src={imagePreview} className="h-16" />}
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tag"
          className="border rounded px-2 py-1 text-sm"
        />
        <button
          onClick={handleTagAdd}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Add Tag
        </button>
        {(post.tags || []).map((tag, idx) => (
          <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleSave(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave(false)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Publish
        </button>
        <button
          onClick={handleDuplicate}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Duplicate
        </button>
      </div>
    </div>
  )
}
