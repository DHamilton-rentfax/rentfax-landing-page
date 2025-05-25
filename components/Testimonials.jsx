import React from "react";

const testimonials = [
  {
    name: "Sandra Gilbert",
    company: "DriveRight Auto",
    text: "We no longer rent blind. RentFax gives us confidence in every transaction."
  },
  {
    name: "Guy Hawkins",
    company: "MODX Rentals",
    text: "RentFax is a must-have for any rental business. It’s reduced our damage claims by 70%."
  },
  {
    name: "James O'Neil",
    company: "FleetLogic",
    text: "The fraud detection and scoring engine is second to none. We’ve avoided 12+ bad rentals."
  },
  {
    name: "Ashley Martinez",
    company: "Empire Auto Rentals",
    text: "Before RentFax, we lost thousands on renters with fake IDs and unpaid damage. Now we catch fraud before it happens. It’s essential."
  },
  {
    name: "Jordan Fields",
    company: "EZLease Car Group",
    text: "Our approval process used to take 15 minutes. With RentFax, it's under 60 seconds — and more accurate than ever."
  },
  {
    name: "Devin Chang",
    company: "SafeDrive Properties",
    text: "We’ve screened over 900 renters using RentFax and flagged 80+ risk cases we never would’ve caught on our own."
  }
];

export default function Testimonials() {
  return (
    <section className="relative w-full overflow-hidden text-white" id="testimonials">
  <div
    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
    style={{ backgroundImage: "url('/testimonial-fleet.jpg')" }}
  />
  <div className="absolute inset-0 bg-black/80" />

  <div className="relative z-10 text-center py-24 px-4 sm:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-16">
          What Our Rental Partners Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-6 sm:px-10 lg:px-20">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/10 p-6 rounded-lg shadow-md text-left hover:bg-white/20 transition"
            >
              <blockquote className="italic mb-4">“{t.text}”</blockquote>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-indigo-200">{t.company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
