/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      input: 'src/main.ts',

      output: {
        entryFileNames: 'maxi-media-player.js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
