// components/CommentSection.jsx
import { useState, useEffect } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const submitComment = async () => {
    if (!text || !email) return alert("Email and comment are required");
    setLoading(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, text, authorEmail: email, avatar })
    });

    if (res.ok) {
      setText('');
      fetchComments();
    } else {
      alert("Failed to post comment.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      <div className="space-y-4">
        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
        {comments.map((c, i) => (
          <div key={i} className="border p-3 rounded bg-white">
            <div className="text-sm text-gray-600">{c.authorEmail}</div>
            <div className="mt-1">{c.text}</div>
            <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <textarea
          rows="4"
          className="w-full p-2 border rounded"
          placeholder="Write your comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input
          type="email"
          className="w-full p-2 mt-2 border rounded"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="url"
          className="w-full p-2 mt-2 border rounded"
          placeholder="Optional avatar URL"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={submitComment}
          disabled={loading}
        >
          {loading ? "Posting..." : "Submit Comment"}
        </button>
      </div>
    </div>
  );
}
