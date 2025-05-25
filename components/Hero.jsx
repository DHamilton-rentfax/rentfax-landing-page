import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#EEF4FF] via-white to-[#F9FBFF] py-28 px-6 text-center">
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Rent Smarter.
          </span>{" "}
          <br />
          Drive Safer.
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10">
          RentFax helps car and home rental companies assess renter risk, uncover fraud,
          and make data-driven decisions with ease.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 shadow-md transition"
          >
            Get Started
          </Link>
          <a
            href="#pricing"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-[1200px] h-[1200px] opacity-10 transform -translate-x-1/2 translate-y-1/2" viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="300" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
