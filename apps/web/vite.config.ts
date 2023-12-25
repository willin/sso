import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8787',
      '/api': 'http://localhost:8787'
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
