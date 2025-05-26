// pages/authors/index.jsx
import Link from "next/link"

const DUMMY_AUTHORS = [
  { slug: "dominique-hamilton", name: "Dominique Hamilton" },
  // TODO: fetch real authors
]

export default function AuthorsIndex() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Authors</h1>
      <ul className="space-y-4">
        {DUMMY_AUTHORS.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/authors/${a.slug}`}
              className="text-indigo-600 hover:underline"
            >
              {a.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
