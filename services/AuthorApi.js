// services/AuthorApi.js

/**
 * Fetch author data by slug from the backend API
 */
export async function getAuthorBySlug(slug) {
  try {
    const res = await fetch(`/api/authors/${slug}`);
    if (!res.ok) throw new Error(`Failed to fetch author: ${slug}`);

    const data = await res.json();
    return data.author || null;
  } catch (err) {
    console.error("getAuthorBySlug error:", err);
    return null;
  }
}

/**
 * Fetch all posts by this author slug
 */
export async function getPostsByAuthor(slug) {
  try {
    const res = await fetch(`/api/blogs?authorSlug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error(`Failed to fetch posts for author: ${slug}`);

    const data = await res.json();
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (err) {
    console.error("getPostsByAuthor error:", err);
    return [];
  }
}
