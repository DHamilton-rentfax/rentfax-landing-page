// <project-root>/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // 1️⃣ Tell React & React Router we’re in production mode
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  resolve: {
    // 2️⃣ Force Vite to use React Router’s “import” (ESM) build first,
    //    which in v7 is the bundled, chunk-free version.
    conditions: ['import', 'default'],
  },
})
