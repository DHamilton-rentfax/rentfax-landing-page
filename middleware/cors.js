// middleware/cors.js

export default function allowCors(handler) {
  return async (req, res) => {
    const originHeader = req.headers.origin;

    // Set allowed origin based on environment
    const allowedOrigin =
      process.env.NODE_ENV === 'production'
        ? 'https://rentfax.io'
        : originHeader || 'http://localhost:3000';

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return handler(req, res);
  };
}
