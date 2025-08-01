/**
 * A tiny fetch wrapper that mirrors axios.create(), always sending HttpOnly cookies.
 * Automatically handles relative vs absolute URLs and environment-based base URLs.
 */

function createAPI() {
  const isServer = typeof window === 'undefined';

  // Pull from correct environment
  const baseUrl = isServer
    ? process.env.API_URL || 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_API_URL || '';

  console.log(`🔍 [createAPI] isServer=${isServer} | baseUrl=${baseUrl}`);

  async function request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

    try {
      const res = await fetch(fullUrl, {
        credentials: 'include',
        ...options,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${options.method || 'GET'} ${url} failed: ${res.status} ${text}`);
      }

      const contentType = res.headers.get('content-type') || '';
      return contentType.includes('application/json') ? res.json() : res.text();
    } catch (err) {
      console.error(`❌ [createAPI] fetch failed for ${url}:`, err);
      throw err;
    }
  }

  return {
    get:    (url)       => request(url),
    post:   (url, data) => request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    patch:  (url, data) => request(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    put:    (url, data) => request(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    delete: (url)       => request(url, { method: 'DELETE' }),

    // 🆕 Blog fetcher for Manage Posts (admin)
    fetchBlogs: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/api/blogs?${query}`);
    }
  };
}

export default createAPI();
