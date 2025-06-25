import Head from "next/head";
import Link from "next/link";

export default function PendingApproval() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center px-4">
      <Head>
        <title>Registration Pending – RentFAX</title>
        <meta name="robots" content="noindex" />
        <meta
          name="description"
          content="Your RentFAX editor registration is pending admin approval."
        />
      </Head>

      <main className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-indigo-700">
          🎉 Registration Received
        </h1>

        <p className="text-gray-600 leading-relaxed">
          Thank you for registering to become an editor at <strong>RentFAX</strong>.
          <br />
          Your account is currently <span className="font-medium text-indigo-600">awaiting admin approval</span>.
          <br />
          You’ll be notified by email once it’s approved.
        </p>

        <Link
          href="/"
          className="inline-block text-indigo-600 font-medium hover:underline transition"
        >
          ← Back to Homepage
        </Link>
      </main>
    </div>
  );
}
