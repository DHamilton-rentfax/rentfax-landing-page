// src/pages/SinglePost.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export const SinglePost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/fetchPosts');
      const data = await res.json();
      const foundPost = data.find((p) => p.slug === slug);
      setPost(foundPost);
    }
    fetchPosts();
  }, [slug]);

  if (!post) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Link to="/blog" className="text-blue-600 hover:underline">&larr; Back to Blog</Link>

      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="text-gray-500 mb-8">
        {new Date().toLocaleDateString()}
      </div>

      {/* Full blog post content */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        {post.content.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </article>
    </div>
  );
};
