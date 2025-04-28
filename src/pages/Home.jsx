// src/pages/Home.jsx
import { FeatureBox } from '../components/FeatureBox';

export const Home = () => {
  return (
    <div className="space-y-24 max-w-7xl mx-auto p-6">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-10">
        <h1 className="text-4xl md:text-6xl font-bold">
          Rent Smarter. Rent Safer. RentFax.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your Renter’s Risk — Measured Instantly.
        </p>
        <a href="#newsletter" className="inline-block px-6 py-3 mt-6 bg-black text-white rounded hover:bg-gray-800">
          Join the Waitlist
        </a>
      </section>

      {/* FEATURE SECTION */}
      <section className="grid md:grid-cols-4 gap-8 text-center">
        <FeatureBox 
          icon="🛡️" 
          title="Real-Time Risk Scores" 
          description="Instantly evaluate customer reliability before renting." 
        />
        <FeatureBox 
          icon="⚡" 
          title="Lightning-Fast Reports" 
          description="Get detailed reports in under 60 seconds." 
        />
        <FeatureBox 
          icon="🔒" 
          title="Built-In Fraud Detection" 
          description="Proactively detect and block high-risk renters." 
        />
        <FeatureBox 
          icon="🌍" 
          title="Global Scalability" 
          description="Designed for rental businesses of all sizes." 
        />
      </section>

      {/* ABOUT SECTION */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">About RentFax</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          RentFax is your trusted partner in rental risk assessment. We protect rental businesses from fraud, defaults, and costly damages — before the keys hand off.
        </p>
      </section>

      {/* NEWSLETTER SECTION */}
      // 📍 Add this to your Home.jsx or Landing Page

<section
  id="newsletter"
  className="relative py-20 px-6 md:px-12 bg-gradient-to-r from-black via-gray-800 to-black text-white overflow-hidden rounded-2xl shadow-2xl max-w-7xl mx-auto my-20"
>
  {/* Background Glow */}
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 opacity-20 blur-3xl"></div>

  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
      Be the First to Experience RentFax
    </h2>
    <p className="text-gray-300 max-w-2xl">
      Join our exclusive waitlist and get early access to a smarter way to assess renters. Stay ahead of the future!
    </p>

    <form
      action="https://formspree.io/f/yourformid" // 👈 Replace with your actual form backend
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
      No spam, ever. We’ll only send updates about RentFax.
    </p>
  </div>
</section>


    </div>
  );
};
