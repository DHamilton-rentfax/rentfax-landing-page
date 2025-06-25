// pages/editor/pending-approval.jsx
import Link from "next/link";
import Head from "next/head";

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 px-4">
      <Head>
        <title>Registration Pending – RentFAX</title>
      </Head>

      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-indigo-700">Registration Submitted</h1>
        <p className="text-gray-600">
          Thank you for registering as an editor on <strong>RentFAX</strong>.
          <br />
          Your account is currently <span className="font-semibold">pending admin approval</span>.
          <br />
          You will receive an email once your account is approved.
        </p>

        <Link
          href="/"
          className="inline-block mt-4 text-indigo-600 hover:underline font-medium"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
} 
