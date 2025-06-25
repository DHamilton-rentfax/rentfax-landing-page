// components/ViewCounter.jsx
import { useEffect, useState } from 'react';

export default function ViewCounter({ postId }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    if (!postId) return;
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId })
    }).then(() => {
      // Pull total views after saving
      fetch(`/api/blogs/${postId}`)
        .then(res => res.json())
        .then(data => setViews(data.views || 0));
    });
  }, [postId]);

  return (
    <div className="text-sm text-gray-500">
      👁️ {views !== null ? `${views} views` : 'Loading...'}
    </div>
  );
}
