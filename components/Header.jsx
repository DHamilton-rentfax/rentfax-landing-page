import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Fetch suggestions with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 1) {
        fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
          .then(res => res.json())
          .then(data => {
            setResults(data.results || []);
            setShowDropdown(true);
          })
          .catch(() => {
            setResults([]);
            setShowDropdown(false);
          });
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setShowDropdown(false);
  };

  const handleSelect = (slug) => {
    router.push(`/blogs/${slug}`);
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          RentFAX
        </Link>

        {/* Search Input */}
        <form
          onSubmit={handleSubmit}
          className="relative flex-1 max-w-md hidden sm:block"
          ref={dropdownRef}
          role="search"
        >
          <label htmlFor="site-search" className="sr-only">Search blog posts</label>
          <input
            id="site-search"
            name="search"
            type="text"
            aria-label="Search blog posts"
            placeholder="Search blog posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowDropdown(true)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {showDropdown && results.length > 0 && (
            <ul className="absolute bg-white border rounded shadow top-full mt-1 w-full z-50 max-h-64 overflow-auto text-sm">
              {results.map((post) => (
                <li
                  key={post.slug?.trim()}

                  onClick={() => handleSelect(post.slug)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {post.title}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Nav Links */}
        <nav className="flex items-center space-x-4 text-sm">
          <Link href="/blogs" className="hover:underline">Blog</Link>
          <Link href="/admin/login" className="hover:underline">Admin Login</Link>
        </nav>
      </div>
    </header>
  );
}
