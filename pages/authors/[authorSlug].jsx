// pages/authors/[authorSlug].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuthorBySlug, getPostsByAuthor } from "../../services/AuthorApi";

export default function AuthorPage() {
  const { authorSlug } = useRouter().query;
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authorSlug) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const fetchedAuthor = await getAuthorBySlug(authorSlug);
        if (!fetchedAuthor) throw new Error("Author not found");
        setAuthor(fetchedAuthor);

        const authorPosts = await getPostsByAuthor(authorSlug);
        setPosts(Array.isArray(authorPosts) ? authorPosts : []);
      } catch (err) {
        console.error("Error loading author or posts", err);
        setError("Unable to load author profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorSlug]);

  if (loading) return <p className="p-8 text-center">Loading author…</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!author) return <p className="p-8 text-center">Author not found.</p>;

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      {/* Author header */}
      <div className="flex items-center space-x-4 mb-8">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name || "Author Avatar"}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 font-bold text-xl">
              {(author.name || "A").charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{author.name || "Unknown Author"}</h1>
          {author.bio && <p className="text-gray-600">{author.bio}</p>}
        </div>
      </div>

      {/* Posts list */}
      <h2 className="text-xl font-semibold mb-4">
        Articles by {author.name || "this author"}
      </h2>

      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug?.trim()}>
              <Link
                href={`/blogs/${post.slug}`}
                className="text-indigo-600 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No posts by this author yet.</p>
      )}
    </main>
  );
}
