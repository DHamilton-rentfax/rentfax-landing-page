import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import ShareButtons from "@/components/ShareButtons";
import AuthorCard from "@/components/AuthorCard";
import NewsletterCTA from "@/components/NewsletterCTA";
import useScrollAnalytics from "@/hooks/useScrollAnalytics";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import CommentSection from "@/components/CommentSection";
import ViewCounter from "@/components/ViewCounter";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ✅ FIXED baseUrl logic
export async function getServerSideProps({ params, req }) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(`${baseUrl}/api/blogs/${params.slug}`);
    if (!res.ok) return { notFound: true };
    const post = await res.json();

    const allRes = await fetch(`${baseUrl}/api/blogs`);
    const allData = await allRes.json();

    const posts = Array.isArray(allData.posts) ? allData.posts : [];
    const index = posts.findIndex((p) => p.slug === params.slug);
    const prevPost = posts[index - 1] || null;
    const nextPost = posts[index + 1] || null;

    return { props: { post, prevPost, nextPost } };
  } catch (err) {
    console.error("Blog fetch error:", err);
    return { notFound: true };
  }
}

export default function BlogPost({ post, prevPost, nextPost }) {
  const [related, setRelated] = useState([]);
  useScrollAnalytics(post._id);

  useEffect(() => {
    if (!post?.tags?.length) return;

    fetch("/api/blogs/related", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: post.tags }),
    })
      .then((r) => r.json())
      .then(setRelated)
      .catch(console.error);
  }, [post?.tags]);

  const estimateReadTime = (text) =>
    Math.max(1, Math.round((text || "").split(" ").length / 200));

  const weeklyViews = Object.entries(post.viewsByDate || {})
    .slice(-7)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString(),
      count,
    }));

  const chartData = {
    labels: weeklyViews.map((v) => v.date),
    datasets: [
      {
        label: "Views",
        data: weeklyViews.map((v) => v.count),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <>
      <Head>
        <title>{post.metaTitle || post.title} – RentFAX Blog</title>
        <meta
          name="description"
          content={post.metaDescription || post.excerpt || ""}
        />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.metaDescription || post.excerpt || ""}
        />
        {post.featuredImage && (
          <meta property="og:image" content={post.featuredImage} />
        )}
      </Head>

      <ReadingProgressBar />

      <section className="w-full pt-24 pb-12 bg-white antialiased">
        <div className="max-w-5xl mx-auto px-4">
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover rounded-lg mb-8 shadow-md"
            />
          )}

          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-xl text-gray-600 mb-4">{post.subtitle}</h2>
          )}
          {post.excerpt && (
            <p className="text-gray-600 mb-6">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-10">
            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">
              {post.author?.[0]?.toUpperCase() || "?"}
            </div>
            <Link
              href={`/authors/${post.authorSlug || post.author || "admin"}`}
              className="font-medium text-gray-700 hover:underline"
            >
              {post.author || "Admin"}
            </Link>
            <span>•</span>
            <span>
              {new Date(post.date || post.updatedAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>{estimateReadTime(post.content)} min read</span>
          </div>

          <article className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* ✅ DOMAIN FIXED */}
          <ShareButtons
            url={`https://rentfax.io/blogs/${post.slug}`}
            title={post.title}
          />

          <AuthorCard
            name={post.author}
            bio={post.authorBio}
            avatar={post.authorAvatar}
          />

          <NewsletterCTA />

          <div className="mt-4 mb-6 text-sm text-gray-500">
            <ViewCounter postId={post._id} />
            <span className="ml-2">
              Last updated{" "}
              {new Date(post.updatedAt || post.date).toLocaleDateString()}
            </span>
          </div>

          {weeklyViews.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Traffic (Last 7 Days)
              </h4>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          <div className="mt-16 border-t pt-10">
            <CommentSection postId={post._id} />
          </div>

          <div className="mt-16 border-t pt-10">
            <h3 className="text-xl font-semibold mb-6">Related Posts</h3>
            {related.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    href={`/blogs/${r.slug}`}
                    key={r._id}
                    className="block p-4 border rounded hover:shadow-md transition"
                  >
                    <h4 className="font-semibold text-lg mb-2">{r.title}</h4>
                    <p className="text-sm text-gray-600">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No related posts found.</p>
            )}
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-10">
            {prevPost && (
              <Link
                href={`/blogs/${prevPost.slug}`}
                className="block p-4 border rounded hover:shadow-md transition"
              >
                <h4 className="font-semibold text-lg mb-2">← Previous Post</h4>
                <p className="text-sm text-gray-600">{prevPost.title}</p>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blogs/${nextPost.slug}`}
                className="block p-4 border rounded hover:shadow-md transition"
              >
                <h4 className="font-semibold text-lg mb-2">Next Post →</h4>
                <p className="text-sm text-gray-600">{nextPost.title}</p>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
