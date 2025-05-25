import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function MediaManager({ onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media/list')
      .then((res) => res.json())
      .then((data) => setMedia(data.media || []))
      .catch(() => toast.error('Failed to load media'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 border rounded shadow bg-white max-h-[70vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Media Library</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((item) => (
            <div key={item.key} className="cursor-pointer" onClick={() => onSelect(item.url)}>
              <img src={item.url} alt={item.key} className="w-full h-40 object-cover rounded" />
              <p className="text-sm truncate mt-1">{item.key.replace('uploads/', '')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
