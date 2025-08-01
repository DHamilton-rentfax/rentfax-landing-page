// services/BlogApi.js

export async function getBlogBySlug(slug) {
  try {
    const res = await fetch(`/api/blogs/${slug.trim()}`);
    if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);

    const data = await res.json();
    if (!data.success || !data.post) {
      throw new Error("Blog post not found or invalid response");
    }

    return data.post;
  } catch (err) {
    console.error("getBlogBySlug error:", err.message || err);
    return null;
  }
}
