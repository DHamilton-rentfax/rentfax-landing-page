// components/Navbar.jsx
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const q = e.target.value;
    setSearch(q);
    if (onSearch) onSearch(q);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        {/* Logo (no <a> wrapper) */}
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          RentFAX
        </Link>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={handleChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Nav links */}
        <nav className="flex gap-7 text-sm">
          <Link
            href="/blogs"
            className="inline-flex items-center px-3 py-2 text-gray-700 hover:underline"
          >
            Blog
          </Link>
          <Link
            href="/admin/login"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
