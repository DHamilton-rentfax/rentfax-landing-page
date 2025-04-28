// src/components/Header.jsx
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <Link to="/" className="text-2xl font-bold">
        RentFax
      </Link>
      <nav className="space-x-6 hidden md:flex items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <a
          href="https://blogs.rentfax.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Blog
        </a>
        <a
          href="#newsletter"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Join Waitlist
        </a>
      </nav>
    </header>
  );
};
