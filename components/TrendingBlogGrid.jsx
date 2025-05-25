// components/TrendingBlogGrid.jsx
import Link from 'next/link';

export default function TrendingBlogGrid({ posts }) {
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">🔥 Trending This Week</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post._id} href={`/blogs/${post.slug}`}>
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{new Date(post.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 mb-2">By {post.author}</p>
                <p className="text-xs text-indigo-600 font-medium">{post.trendingScore} views this week</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
