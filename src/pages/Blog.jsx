// src/pages/Blog.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/fetchPosts');
      const data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-12">Our Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            {/* Optional header image area */}
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              {/* If you had a Cover image field in Notion, you could render it here */}
              No Image
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-6 flex-1">{post.excerpt}</p>

              <Link
                to={`/blog/${post.slug}`}
                className="inline-block mt-auto text-blue-600 font-semibold hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
