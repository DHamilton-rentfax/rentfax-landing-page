import parse from "html-react-parser";

export default function BlogPreview({ post }) {
  return (
    <div className="prose max-w-4xl mx-auto">
      <h1>{post.title}</h1>
      <p className="text-gray-500">{post.subtitle}</p>
      {parse(post.content || "")}
    </div>
  );
}
