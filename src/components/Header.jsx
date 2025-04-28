// src/components/Header.jsx
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <div className="text-2xl font-bold">
        RentFax
      </div>
      <nav className="space-x-6 hidden md:flex">
        <Link to="/" className="hover:underline">Home</Link>

        {/* 🔥 Change this Blog Link */}
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
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Join Waitlist
        </a>
      </nav>
    </header>
  );
};
