import React from "react";

export default function NewsletterCTA() {
  return (
    <div className="mt-20 p-6 border rounded shadow-md bg-gray-50 text-center">
      <h3 className="text-xl font-semibold mb-2 text-indigo-800">Get the latest insights</h3>
      <p className="text-gray-600 mb-4">Join the RentFAX newsletter and stay updated.</p>
      <form
        action="https://your-brevo-or-mailchimp-url"
        method="post"
        target="_blank"
        className="flex flex-col sm:flex-row justify-center gap-2"
      >
        <input
          type="email"
          name="EMAIL"
          required
          placeholder="you@example.com"
          className="px-4 py-2 border rounded w-full max-w-xs"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
