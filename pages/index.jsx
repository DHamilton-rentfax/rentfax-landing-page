// pages/index.jsx
import Head from "next/head"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"
import Pricing from "@/components/Pricing"
import BlogList from "@/components/BlogList"

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`)
    const blogs = await res.json()
    return { props: { blogs } }
  } catch (err) {
    console.error("Blog fetch error:", err)
    return { props: { blogs: [] } }
  }
}

export default function Home({ blogs }) {
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
        <section className="w-full">
          <Hero />
        </section>

        <section className="w-full bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Features />
          </div>
        </section>

        <section className="w-full bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Testimonials />
          </div>
        </section>

        <section className="w-full bg-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Pricing />
          </div>
        </section>

        {/* ✅ Blog Section */}
        <section className="w-full bg-gray-100 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Latest Blog Posts</h2>
            <BlogList blogs={blogs} />
          </div>
        </section>
      </main>

      <footer className="w-full bg-gray-100 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RentFAX. All rights reserved.
      </footer>
    </>
  )
}
