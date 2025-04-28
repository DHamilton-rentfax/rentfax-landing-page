// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { FeatureBox } from "../components/FeatureBox";
import { Footer } from "../components/Footer";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 space-y-16 bg-gray-50 dark:bg-gray-900">

      {/* 🚀 Hero Section */}
      <section className="text-center mt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to RentFax
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-10">
          The smarter way to assess renter risk before you rent.  
          Protect your vehicles, homes, and assets with real-time verification and risk analysis.
        </p>
        <a
          href="#newsletter"
          className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Join Waitlist
        </a>
      </section>

      {/* 📊 Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto mt-20 px-6">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
          <img src="/icons/shield.svg" alt="Shield" className="w-12 h-12 mb-4" />
          <h3 className="font-bold text-xl mb-2">Real-Time Risk Scores</h3>
          <p className="text-gray-600 text-sm">
            Instantly evaluate customer reliability before renting.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
          <img src="/icons/flash.svg" alt="Flash" className="w-12 h-12 mb-4" />
          <h3 className="font-bold text-xl mb-2">Lightning-Fast Reports</h3>
          <p className="text-gray-600 text-sm">
            Get detailed reports in under 60 seconds.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
          <img src="/icons/lock.svg" alt="Lock" className="w-12 h-12 mb-4" />
          <h3 className="font-bold text-xl mb-2">Built-In Fraud Detection</h3>
          <p className="text-gray-600 text-sm">
            Proactively detect and block high-risk renters.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
          <img src="/icons/globe.svg" alt="Globe" className="w-12 h-12 mb-4" />
          <h3 className="font-bold text-xl mb-2">Global Scalability</h3>
          <p className="text-gray-600 text-sm">
            Designed for rental businesses of all sizes.
          </p>
        </div>
      </section>

      {/* ✉️ Newsletter Signup Section */}
      <section
        id="newsletter"
        className="relative py-20 px-6 md:px-12 bg-gradient-to-r from-black via-gray-800 to-black text-white overflow-hidden rounded-2xl shadow-2xl max-w-7xl mx-auto my-20"
      >
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Be the First to Experience RentFax
          </h2>
          <p className="text-gray-300 max-w-2xl">
            Join our exclusive waitlist and get early access to a smarter way to assess renters. Stay ahead of the future!
          </p>

          <form
            action="https://formspree.io/f/mdkgkrwd" // TODO: Replace with your actual Formspree/Brevo ID
            method="POST"
            className="flex flex-col md:flex-row gap-4 mt-6 w-full max-w-2xl"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="flex-1 p-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-lg transition-all"
            >
              Join Waitlist
            </button>
          </form>

          <p className="text-gray-400 text-xs mt-4">
            No spam. Only important RentFax updates.
          </p>
        </div>
      </section>
   </main>
  );
};
