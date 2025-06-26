import { useState, useEffect } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  // Load approved comments from API
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  // Submit comment to API
  const submitComment = async () => {
    if (!text.trim() || !email.trim()) {
      alert("Please enter your email and comment.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          text: text.trim(),
          authorEmail: email.trim(),
          avatar: avatar.trim(),
        }),
      });

      if (res.ok) {
        setText('');
        fetchComments();
      } else {
        alert("Failed to submit comment.");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("An error occurred while posting your comment.");
    }

    setLoading(false);
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="space-y-4">
        {!Array.isArray(comments) || comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="border p-4 rounded bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                {c.avatar && (
                  <img
                    src={c.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="text-sm text-gray-700 font-medium">{c.authorEmail}</div>
              </div>
              <p className="text-gray-800">{c.text}</p>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 space-y-3">
        <textarea
          rows="4"
          className="w-full p-3 border rounded resize-none"
          placeholder="Write your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="email"
          className="w-full p-3 border rounded"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="url"
          className="w-full p-3 border rounded"
          placeholder="Optional avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <button
          className="w-full py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition"
          onClick={submitComment}
          disabled={loading}
        >
          {loading ? 'Posting…' : 'Submit Comment'}
        </button>
      </div>
    </div>
  );
}
