import parse from "html-react-parser";

export default function BlogPreview({ post }) {
  if (!post || !post.title) {
    return <div className="text-center text-gray-400 py-20">No blog post data.</div>;
  }

  const authorName =
    post.authorName ||
    post.author?.fullName ||
    post.author?.email ||
    (typeof post.author === "string" ? post.author : "") ||
    "Unknown";

  return (
    <div className="prose prose-lg max-w-4xl mx-auto">
      <h1>{post.title}</h1>

      <p className="text-gray-500 italic mb-2">By {authorName}</p>

      {post.subtitle && (
        <p className="text-gray-500 text-sm mb-4">{post.subtitle}</p>
      )}

      {post.content ? parse(post.content) : <p className="text-gray-400">No content available.</p>}
    </div>
  );
}
