// pages/admin/comments.jsx
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user?.roles?.[0] !== "admin") {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/comments")
      .then((r) => r.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch comments");
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      setComments((curr) => curr.filter((c) => c._id !== id));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  const filtered = comments.filter(
    (c) =>
      c.text?.toLowerCase().includes(search.toLowerCase()) ||
      c.authorEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <Head>
        <title>Admin Comments – RentFAX</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comments</h1>
        <input
          type="text"
          placeholder="Search by email or text"
          className="border px-3 py-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No comments found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <p className="text-gray-800 mb-1">{c.text}</p>
                <p className="text-sm text-gray-500">
                  From: <span className="font-medium">{c.authorEmail}</span>
                </p>
                <Link
                  href={`/blogs/${c.postSlug}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View Blog ↗
                </Link>
              </div>
              <button
                onClick={() => handleDelete(c._id)}
                className="text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
