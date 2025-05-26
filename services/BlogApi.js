// services/BlogApi.js
export async function getBlogBySlug(slug) {
  const res = await fetch(`/api/blogs/${slug}`)
  if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`)
  return res.json()
}
