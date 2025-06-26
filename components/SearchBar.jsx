// components/SearchBar.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 1) {
        fetch(`/api/search?q=${query}`)
          .then(res => res.json())
          .then(data => {
            setResults(data);
            setShowDropdown(true);
          });
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search blog posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded w-64"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 bg-white border rounded w-full mt-1 shadow-md">
          {results.map(post => (
            <li
              key={post._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                router.push(`/blogs/${post.slug}`);
                setQuery('');
                setShowDropdown(false);
              }}
            >
              {post.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
