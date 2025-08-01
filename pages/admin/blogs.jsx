import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/auth/blogs', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        console.log('✅ [AdminBlogs] Raw API response:', res);

        const rawPosts = res?.posts;
        if (!Array.isArray(rawPosts)) {
          console.error('❌ [AdminBlogs] `posts` is not an array:', rawPosts);
          setBlogs([]);
          setFiltered([]);
          return;
        }

        const cleanPosts = rawPosts
          .filter((p) => p?.slug && p?.title)
          .map((p) => ({
            ...p,
            slug: p.slug.trim(),
            author:
              p.authorName ||
              (typeof p.author === 'object'
                ? p.author.fullName || p.author.email
                : p.author) ||
              'Unknown',
          }));

        setBlogs(cleanPosts);
        setFiltered(cleanPosts);
        console.log('✅ [AdminBlogs] Cleaned blogs:', cleanPosts);
      } catch (err) {
        console.error('❌ [AdminBlogs] Failed to fetch blogs:', err);
        setBlogs([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const results = blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(term) ||
        b.slug?.toLowerCase().includes(term)
    );
    setFiltered(results);
  }, [search, blogs]);

  const handleEdit = (slug) => {
    if (!slug) return;
    const cleanSlug = slug.trim();
    router.push(`/admin/editor?edit=${encodeURIComponent(cleanSlug)}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Blog Manager</h1>
        <button
          onClick={() => router.push('/admin/editor')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          + New Post
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title or slug..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 border rounded mb-6"
      />

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg text-indigo-800 mb-1">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600">
                {new Date(post.date || post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Author:</strong> {post.author}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Status:</strong> {post.status || 'Draft'}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(post.slug)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <a
                  href={`/blogs/${encodeURIComponent(post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline text-sm"
                >
                  View
                </a>
                <button
                  onClick={() => alert('Trash not implemented yet')}
                  className="text-red-600 hover:underline text-sm"
                >
                  Trash
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
