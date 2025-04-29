// <project-root>/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Make React Router use its production build (no missing chunks)
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  // Tell Vite to prefer the "production" export condition
  resolve: {
    conditions: ['production', 'import', 'module', 'default'],
  },
})
