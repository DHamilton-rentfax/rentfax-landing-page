// src/components/Header.jsx
import React from "react";

export function Header() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <h1 className="text-3xl text-black font-bold">RentFax</h1>

        {/* Navigation */}
        <nav className="space-x-6">
          <a
            href="/"
            className="text-gray-700 hover:text-gray-900"
          >
            Home
          </a>

          {/* external out to your Hashnode blog */}
          <a
            href="https://blogs.rentfax.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            Blog
          </a>

          <a
            href="#waitlist"
            className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Join Waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}
