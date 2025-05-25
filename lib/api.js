// lib/api.js

/**
 * A tiny fetch wrapper that mirrors axios.create(), always sending HttpOnly cookies.
 */
function createAPI() {
  async function request(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'include', // send HttpOnly cookie for auth
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${options.method || 'GET'} ${url} failed: ${res.status} ${text}`);
    }

    const contentType = res.headers.get('content-type') || '';
    return contentType.includes('application/json') ? res.json() : res.text();
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
  };
}

export default createAPI();
