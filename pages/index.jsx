// pages/index.jsx
import Head from "next/head"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"
import Pricing from "@/components/Pricing"

export default function Home() {
  return (
    <>
      <Head>
        <title>RentFAX – Renter Risk Reports</title>
        <meta
          name="description"
          content="Protect your rental business with smart risk insights, fraud alerts, and verified rental history from RentFAX."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full bg-white text-gray-800">
        {/* Hero (full width - Hero component itself can handle its own bg & padding) */}
        <section className="w-full">
          <Hero />
        </section>

        {/* Features (full width white bg) */}
        <section className="w-full bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Features />
          </div>
        </section>

        {/* Testimonials (full width gray-50 bg) */}
        <section className="w-full bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Testimonials />
          </div>
        </section>

        {/* Pricing (full width white bg) */}
        <section className="w-full bg-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Pricing />
          </div>
        </section>
      </main>

      <footer className="w-full bg-gray-100 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RentFAX. All rights reserved.
      </footer>
    </>
  )
}
