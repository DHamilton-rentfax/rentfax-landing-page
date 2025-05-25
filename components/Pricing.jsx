import React from "react";

const plans = [
  {
    name: "Pay As You Go",
    price: "$20",
    subtitle: "per report",
    features: ["Single Report Access", "Instant Report Delivery", "No Subscription Required"],
    active: false
  },
  {
    name: "Pro Pack",
    price: "$149",
    subtitle: "for 50 reports",
    features: ["50 Reports", "Priority Report Queueing", "Email Support"],
    active: true
  },
  {
    name: "Unlimited Access",
    price: "$299",
    subtitle: "beta unlimited",
    features: ["Unlimited Reports", "Dedicated Manager", "Full Dashboard Access"],
    active: false
  }
];

const Pricing = () => {
  return (
    <section className="py-24 px-6 bg-gray-50 text-center" id="pricing">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-14 text-gray-800">
          Beta Pricing Plans
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`${plan.active ? "border-indigo-600 bg-white shadow-lg" : "border-gray-200 bg-white"} border rounded-2xl p-8 transition hover:shadow-xl`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{plan.name}</h3>
              <p className="text-4xl font-bold text-indigo-600">{plan.price}</p>
              <p className="text-gray-500 mb-6 text-sm">{plan.subtitle}</p>
              <ul className="text-gray-700 space-y-2 mb-6 text-sm text-left">
                {plan.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>
              <a
                href="/signup"
                className="inline-block w-full py-3 rounded-full font-semibold transition text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Choose Plan
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
