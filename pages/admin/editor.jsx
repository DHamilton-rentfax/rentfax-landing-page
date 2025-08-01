import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^À-ɏ\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [editSlug, setEditSlug] = useState(null);
  const quillRef = useRef();

  const isEditing = Boolean(editSlug);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    createdAt: new Date().toISOString(),
    category: "",
    tags: "",
    image: "",
    ogImage: "",
    metaTitle: "",
    metaDescription: "",
    published: true,
  });

  const [slugAvailable, setSlugAvailable] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Fix: Wait until auth is resolved before redirecting
  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/admin/login");
    }
  }, [user]);

  // ✅ Set editSlug from URL
  useEffect(() => {
    if (router.isReady && router.query.edit) {
      setEditSlug(router.query.edit.trim());
    }
  }, [router.isReady, router.query.edit]);

  // ✅ Slug generation for new post
  useEffect(() => {
    if (form.title && !isEditing) {
      const generated = slugify(form.title);
      setForm((prev) => ({ ...prev, slug: generated }));

      const checkSlug = async () => {
        try {
          const res = await fetch(`/api/blogs/check-slug?slug=${generated}`);
          const json = await res.json();
          setSlugAvailable(json.available);
        } catch (err) {
          console.error("Slug check error:", err);
          setSlugAvailable(null);
        }
      };

      checkSlug();
    }
  }, [form.title, isEditing]);

  // ✅ Load blog post if editing, and user is loaded
  useEffect(() => {
    if (!isEditing || !editSlug || user === undefined) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/auth/blogs/${editSlug}`);
        const data = res.data?.post;

        if (!data || !data.title) {
          toast.error("Post not found");
          return router.replace("/admin/blogs");
        }

        setForm({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          author: data.author || user?.email || "Unknown",
          createdAt: data.date || new Date().toISOString(),
          category: data.category || "",
          tags: (data.tags || []).join(", "),
          image: data.image || "",
          ogImage: data.image || "",
          metaTitle: data.metaTitle || data.title || "",
          metaDescription: data.metaDescription || data.excerpt || "",
          published: data.status === "Published" || data.status === "published",
        });

        setPreview(data.image || null);
      } catch (err) {
        console.error("Error loading blog post", err);
        toast.error("Failed to load blog");
        router.replace("/admin/blogs");
      }
    };

    fetchPost();
  }, [isEditing, editSlug, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("No image selected");

    setPreview(URL.createObjectURL(file));
    setLoadingImage(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Upload failed");

      setForm((prev) => ({ ...prev, image: result.url, ogImage: result.url }));
      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (!slugAvailable && !isEditing) {
        toast.error("Slug is already taken.");
        return;
      }

      const payload = {
        title: form.title,
        slug: form.slug.trim(),
        excerpt: form.excerpt,
        content: form.content,
        author: user?.email || "Unknown",
        createdAt: form.createdAt,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        featuredImage: form.image,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        status: form.published ? "published" : "draft",
      };

      if (isEditing) {
        await api.put(`/api/blogs/${editSlug}`, payload);
        toast.success("Post updated");
      } else {
        await api.post("/api/blogs", payload);
        toast.success("Post created");
      }

      router.replace("/admin/blogs");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Blog Post" : "New Blog Post"}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="text-sm text-gray-600 underline"
          >
            ← Back to Dashboard
          </button>
          {form.slug && (
            <a
              href={`/blogs/${form.slug.trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              View Post
            </a>
          )}
        </div>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border px-3 py-2 rounded" />
        <div>
          <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="border px-3 py-2 rounded w-full" />
          {form.slug && (
            <p className="text-sm mt-1">
              {slugAvailable === null && "Checking slug…"}
              {slugAvailable === true && <span className="text-green-600">✅ Available</span>}
              {slugAvailable === false && <span className="text-red-600">❌ Taken</span>}
            </p>
          )}
        </div>
        <input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="border px-3 py-2 rounded" />
        <input type="date" name="createdAt" value={form.createdAt.split("T")[0]} onChange={handleChange} className="border px-3 py-2 rounded" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border px-3 py-2 rounded" />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="border px-3 py-2 rounded" />
        <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="Meta Title" className="border px-3 py-2 rounded md:col-span-2" />
        <input name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="Meta Description" className="border px-3 py-2 rounded md:col-span-2" />
        <label className="flex items-center gap-2 mt-1">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} /> Published
        </label>
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Featured Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loadingImage} />
        {preview && <img src={preview} alt="Preview" className="w-60 h-40 object-cover rounded mt-4" />}
      </div>

      {/* CONTENT */}
      <div className="mb-8">
        <ReactQuill
          ref={quillRef}
          value={form.content}
          onChange={(v) => setForm((p) => ({ ...p, content: v }))}
          placeholder="Write your blog post..."
          className="bg-white rounded"
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-6 py-3 rounded text-white ${saving ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {saving ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </div>
  );
}
