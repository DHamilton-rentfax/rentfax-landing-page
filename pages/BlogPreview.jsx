// src/pages/BlogPreview.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogBySlug } from '../services/BlogApi';

export default function BlogPreview() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error('Failed to fetch blog', err);
      }
    };
    fetchBlog();
  }, [slug]);

  if (!blog) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <div className="text-gray-600 mb-4">
        By {blog.author} • {new Date(blog.date).toLocaleDateString()} • {blog.status}
      </div>
      {blog.image && (
        <img src={blog.image} alt="Cover" className="rounded-lg mb-6" />
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
