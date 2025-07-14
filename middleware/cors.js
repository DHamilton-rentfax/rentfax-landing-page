// middleware/cors.js

export default function allowCors(handler) {
  return async (req, res) => {
    const origin =
      process.env.NODE_ENV === 'production'
        ? 'https://rentfax.io'
        : req.headers.origin || 'http://localhost:3000';

    // Never use "*" when credentials are allowed
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
}
