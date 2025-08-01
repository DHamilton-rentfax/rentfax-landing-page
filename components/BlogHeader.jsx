import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

export default function BlogHeader({ allPosts = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const fuse = useMemo(() => {
    return new Fuse(allPosts, {
      keys: ["title", "excerpt", "tags"],
      threshold: 0.3,
    });
  }, [allPosts]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
    } else {
      const found = fuse.search(query).map((r) => r.item);
      setResults(found);
    }
  }, [query, fuse]);

  const getAuthorName = (post) =>
    post.authorName ||
    post.author?.fullName ||
    post.author?.email ||
    post.author ||
    "Unknown";

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm w-full">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-indigo-600 cursor-pointer">📰 RentFAX</span>
        </Link>

        {/* Search */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm"
        />

        {/* Nav Links */}
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/blogs">
            <span className="hover:underline text-gray-700 cursor-pointer">Blog</span>
          </Link>
          <Link href="/admin/login">
            <span className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 cursor-pointer">
              Admin Login
            </span>
          </Link>
        </nav>
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="w-full bg-white mt-2 border-t">
          <div className="max-w-screen-2xl mx-auto px-6 py-3">
            <ul className="divide-y divide-gray-200">
              {results.map((post) => (
                <li key={post.slug?.trim()}
 className="py-2">
                  <Link href={`/blogs/${post.slug}`}>
                    <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                      {post.title}
                    </span>
                  </Link>
                  <p className="text-gray-500 text-sm">
                    By {getAuthorName(post)}
                  </p>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm">{post.excerpt}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
