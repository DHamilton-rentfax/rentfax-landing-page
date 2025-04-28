// src/pages/Blog.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../api/hashnodeApi";

export const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    loadPosts();
  }, []);

  if (!posts.length) {
    return (
      <div className="text-center p-20 text-gray-500">
        Loading blog posts...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-center mb-16 tracking-tight">
        Rent Smarter. Rent Safer. RentFax.
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
          >
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-700">
                No Image
              </div>
            )}

            <div className="flex flex-col flex-1 p-6">
              <h2 className="text-2xl font-bold mb-3 leading-tight">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-base flex-1">
                {post.brief.length > 120
                  ? post.brief.slice(0, 120) + "..."
                  : post.brief}
              </p>

              <Link
                to={`/blog/${post.slug}`}
                className="inline-block mt-6 text-blue-600 hover:text-blue-800 font-semibold text-sm"
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
