// pages/blogs/[slug].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (slug) {
      fetch(`/api/blogs/${slug}`)
        .then((res) => res.json())
        .then(setBlog)
        .catch((err) => console.error('Failed to load blog', err));
    }
  }, [slug]);

  if (!blog) return <div className="p-10 text-center">Loading...</div>;

  const sortedDates = Object.keys(blog.viewsByDate || {}).sort((a, b) => new Date(a) - new Date(b));
  const viewData = sortedDates.map(date => blog.viewsByDate[date]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-500 mb-4">{blog.subtitle}</p>
      <p className="text-sm text-gray-400 mb-6">
        {new Date(blog.date).toLocaleDateString()} • {blog.author} • {blog.views} views
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {sortedDates.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">📈 Daily Views</h2>
          <Bar
            data={{
              labels: sortedDates,
              datasets: [{
                label: 'Daily Views',
                data: viewData,
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
              }],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      )}
    </div>
  );
}
