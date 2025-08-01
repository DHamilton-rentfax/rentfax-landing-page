import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Search failed', err);
        setLoading(false);
      });
  }, [q, page]);

  const highlightText = (text, indices) => {
    if (!indices?.length) return text;

    const parts = [];
    let last = 0;

    indices.forEach(([start, end], idx) => {
      if (start > last) parts.push(text.slice(last, start));
      parts.push(
        <mark key={idx} className="bg-yellow-200">
          {text.slice(start, end + 1)}
        </mark>
      );
      last = end + 1;
    });

    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Head>
        <title>Search Results for "{q}" | RentFAX</title>
        <meta name="description" content={`Search results for "${q}" on RentFAX.`} />
      </Head>

      <h1 className="text-2xl font-bold mb-6">
        Search Results for <span className="text-indigo-600">"{q}"</span>
      </h1>

      {loading && <p className="text-gray-500">Loading results...</p>}

      {!loading && results.length === 0 && (
        <div className="text-gray-500">
          <p>No blog posts found for your search.</p>
          <p className="mt-2">Try searching for:</p>
          <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
            <li>renter scoring</li>
            <li>fraud prevention</li>
            <li>vehicle verification</li>
          </ul>
        </div>
      )}

      {results.map((post) => (
        <div key={post.slug?.trim()}
 className="mb-6 border-b pb-4">
          <Link href={`/blogs/${post.slug}`}>
            <h2 className="text-lg font-semibold text-indigo-600 hover:underline truncate">
              {post.highlight?.find((h) => h.key === 'title')
                ? highlightText(post.title, post.highlight.find((h) => h.key === 'title').indices)
                : post.title}
            </h2>
          </Link>
          {post.excerpt && (
            <p className="text-sm text-gray-600 mt-1">
              {post.highlight?.find((h) => h.key === 'excerpt')
                ? highlightText(post.excerpt, post.highlight.find((h) => h.key === 'excerpt').indices)
                : post.excerpt}
            </p>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded text-sm ${
                page === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
