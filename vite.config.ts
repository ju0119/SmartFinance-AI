import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: './', // Use relative paths for GitHub Pages compatibility
    define: {
      // Polyfill process.env for the Gemini SDK and other legacy usages
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || process.env.API_KEY),
        // Add other env vars here if needed
      }
    },
    build: {
      outDir: 'dist',
    }
  }
})