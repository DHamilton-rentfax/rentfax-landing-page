// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { ShieldCheck, Zap, Lock, Globe } from "lucide-react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Footer } from "../components/Footer";

const features = [
  {
    Icon: ShieldCheck,
    title: "Real-Time Risk Scores",
    desc: "Instantly evaluate customer reliability before renting.",
  },
  {
    Icon: Zap,
    title: "Lightning-Fast Reports",
    desc: "Get detailed reports in under 60 seconds.",
  },
  {
    Icon: Lock,
    title: "Built-In Fraud Detection",
    desc: "Proactively detect and block high-risk renters.",
  },
  {
    Icon: Globe,
    title: "Global Scalability",
    desc: "Designed for rental businesses of all sizes.",
  },
];

export const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="pt-24 pb-16 text-center px-4">
        <h1 className="text-5xl font-extrabold">
          Rent Smarter. Rent Safer. RentFax.
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Your renter’s risk — measured instantly. Protect your assets with
          real-time verification and fraud detection.
        </p>
        {/* Hero “Join Waitlist” scrolls to form */}
        <a
          href="#newsletter"
          className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Join the Waitlist
        </a>
      </section>

      {/* Features */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ Icon, title, desc }) => (
            <FeatureCard key={title} Icon={Icon} title={title} desc={desc} />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mt-20 text-center px-4">
        <h2 className="text-3xl font-semibold mb-4">About RentFax</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          RentFax is your trusted partner in rental risk assessment. We protect
          rental businesses from fraud, defaults, and costly damages — before the
          keys change hands.
        </p>
      </section>

      {/* Newsletter / Waitlist Form */}
      <section
        id="newsletter"
        className="mt-20 py-16 px-6 bg-gray-100 text-center rounded-lg mx-4 md:mx-0"
      >
        <h3 className="text-2xl font-bold mb-4">Stay in the Loop</h3>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Subscribe for product updates, industry insights, and early access
          invites.
        </p>
        <form
          action="https://formspree.io/f/mdkgkrwd"
          method="POST"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
};

function FeatureCard({ Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition">
      <Icon className="w-10 h-10 text-black mb-3" />
      <h4 className="font-bold text-xl mb-2">{title}</h4>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
