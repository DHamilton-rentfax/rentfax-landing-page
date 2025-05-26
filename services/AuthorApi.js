// services/AuthorApi.js

/**
 * Fetch author “record” (for now stubbed out — replace with a real API later)
 */
export async function getAuthorBySlug(slug) {
  // TODO: replace with fetch('/api/authors/'+slug)
  return {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    bio: "This author hasn’t added a bio yet.",
    avatar: "", // or a default URL
  }
}

/**
 * Fetch all posts by this author slug
 */
export async function getPostsByAuthor(slug) {
  const res = await fetch(`/api/blogs?author=${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error(`Failed to fetch posts for ${slug}`)
  return res.json()
}
