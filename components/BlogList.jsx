import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import stripHtml from "@/utils/stripHtml";
import { useAuth } from "@/context/AuthContext";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const router = useRouter();

  const currentPage = parseInt(router.query.page || 1, 10);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs?page=${currentPage}`);
        const data = await res.json();

        if (!data.success || !Array.isArray(data.posts)) {
          throw new Error("Invalid blog response format.");
        }

        const formatted = data.posts
          .filter((p) => p?.slug && p?.title)
          .map((p) => {
            const authorName =
              p.authorName ||
              p.author?.fullName ||
              p.author?.email ||
              (typeof p.author === "string" ? p.author : "") ||
              "Unknown";

            return {
              ...p,
              slug: p.slug.trim(),
              image: p.image?.startsWith("http") ? p.image : `${p.image}`,
              cleanContent: stripHtml(p.content || ""),
              author: authorName,
              authorSlug: authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              authorAvatar: p.authorAvatar || "",
              views: p.views || 0,
              excerpt: p.excerpt || "",
            };
          });

        setBlogs(formatted);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("❌ Error loading blogs:", err);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const readTime = (text) =>
    Math.max(1, Math.round((text || "").split(" ").length / 200));

  const renderMeta = (post) => (
    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
      {post.authorAvatar ? (
        <img
          src={post.authorAvatar}
          alt={post.author}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-700 font-medium">
            {post.author?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
      )}
      <span className="font-medium text-gray-700">{post.author}</span>
      <span>•</span>
      <span>⏱ {readTime(post.cleanContent)} min read</span>
      <span>•</span>
      <span>{post.views} views</span>
    </div>
  );

  if (!blogs.length) {
    return (
      <div className="p-12 text-center text-gray-500">No blog posts found.</div>
    );
  }

  const hero = blogs[0];
  const trending = blogs.slice(1, 4);
  const gridPosts = blogs.slice(4);

  return (
    <main className="py-28 pb-12 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-800">
        RentFAX Insights
      </h1>

      {/* HERO */}
      <section className="mb-16">
        <Link
          href={`/blogs/${hero.slug}`}
          className="group block overflow-hidden rounded-xl shadow hover:shadow-xl transition"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <img
              src={hero.image}
              className="w-full h-80 object-cover rounded-xl"
              alt={hero.title}
            />
            <div className="p-6">
              <h2 className="text-3xl font-bold text-indigo-700 mb-4 group-hover:text-indigo-600">
                {hero.title}
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {hero.excerpt || hero.cleanContent.slice(0, 200) + "…"}
              </p>
              {renderMeta(hero)}
            </div>
          </div>
        </Link>
      </section>

      {/* TRENDING */}
      {trending.length > 0 && (
        <section className="mb-16">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Trending</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {trending.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="group rounded-xl bg-white shadow hover:shadow-lg transition"
              >
                <img
                  src={post.image}
                  className="w-full h-40 object-cover rounded-t-xl"
                  alt={post.title}
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-indigo-700 group-hover:text-indigo-600 mb-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {stripHtml(post.excerpt || "")}
                  </p>
                  {renderMeta(post)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* GRID POSTS */}
      {gridPosts.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            More from the Blog
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="group block overflow-hidden rounded-xl bg-white shadow hover:shadow-md transition"
              >
                <img
                  src={post.image}
                  className="w-full h-48 object-cover"
                  alt={post.title}
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-indigo-800 group-hover:text-indigo-600 mb-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {stripHtml(post.excerpt || "")}
                  </p>
                  {renderMeta(post)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/blogs?page=${p}`}
              scroll={false}
              className={`px-4 py-2 border rounded ${
                p === currentPage
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
