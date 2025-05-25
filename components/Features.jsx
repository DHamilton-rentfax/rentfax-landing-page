import React from "react";

const features = [
  {
    title: "Renter Risk Scoring",
    description: "Instantly calculate renter risk using behavioral, financial, and fraud signals with each application.",
    icon: "🧠"
  },
  {
    title: "Rental History Timeline",
    description: "Access incident-level history like damage, smoke, or late returns submitted by verified rental operators.",
    icon: "📜"
  },
  {
    title: "AI Fraud Detection",
    description: "Prevent scams with facial recognition, ID analysis, and real-time behavioral modeling.",
    icon: "🕵️‍♂️"
  },
  {
    title: "Verified Identity & License",
    description: "Cross-check state-issued licenses, expiration status, and digital ID matches in seconds.",
    icon: "🪪"
  },
  {
    title: "Network-Wide Flag System",
    description: "See alerts from other companies about renters flagged for damage, nonpayment, or fraud.",
    icon: "🚨"
  },
  {
    title: "Smart Pricing Insights",
    description: "Compare pricing across similar inventory in real-time and get recommendations on profitable pricing.",
    icon: "📈"
  }
];

const Features = () => {
  return (
    <section className="bg-white-50 py-20" id="features">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-14">
          RentFAX Core Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-md transition text-left"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 text-2xl mb-4">
                {feat.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-600">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
